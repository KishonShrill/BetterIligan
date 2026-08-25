'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createAdminSession, destroyAdminSession, isAdmin } from '@/lib/bangonAuth';

export type ActionResult = { success: true } | { success: false; error: string };

// Records a moderation action in the append-only audit trail. Best-effort:
// a logging failure must not block the moderation action itself.
async function audit(action: string, entityType: string, entityId: string): Promise<void> {
    try {
        const db = await getDb();
        await db
            .prepare(
                'INSERT INTO bangon_audit_log (id, actor, action, entity_type, entity_id) VALUES (?1, ?2, ?3, ?4, ?5)',
            )
            .bind(crypto.randomUUID(), 'admin', action, entityType, entityId)
            .run();
    } catch (err) {
        console.error('audit log failed:', err);
    }
}

// Guards every mutation below — throws if the caller lacks a valid session, so
// a forged request to the action endpoint can't mutate data.
async function assertAdmin(): Promise<void> {
    if (!(await isAdmin())) throw new Error('Unauthorized');
}

export async function adminLogin(formData: FormData): Promise<ActionResult> {
    const password = String(formData.get('password') ?? '');
    const ok = await createAdminSession(password);
    return ok ? { success: true } : { success: false, error: 'Incorrect password.' };
}

export async function adminLogout(): Promise<void> {
    await destroyAdminSession();
    redirect('/bangon-iligan/admin/login');
}

async function setBoardStatus(id: string, status: 'approved' | 'hidden'): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db
        .prepare("UPDATE bangon_board_messages SET status = ?1, updated_at = datetime('now') WHERE id = ?2")
        .bind(status, id)
        .run();
    await audit(`board:${status}`, 'board_message', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

// Bound with the row id in the form; the trailing FormData is supplied by the
// <form action> invocation and unused.
export async function approveBoardMessage(id: string): Promise<void> {
    await setBoardStatus(id, 'approved');
}

export async function hideBoardMessage(id: string): Promise<void> {
    await setBoardStatus(id, 'hidden');
}

// Un-publishes an approved message — returns it to the pending review board
// (status 'pending', not 'hidden') so a moderator can re-review it. Distinct
// from hide (rejects out of the queue) and delete (drops the row).
export async function unpublishBoardMessage(id: string): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db
        .prepare("UPDATE bangon_board_messages SET status = 'pending', updated_at = datetime('now') WHERE id = ?1")
        .bind(id)
        .run();
    await audit('board:unpublished', 'board_message', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

// Hard-deletes a board message — for accidentally-approved or abusive posts.
export async function deleteBoardMessage(id: string): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db.prepare('DELETE FROM bangon_board_messages WHERE id = ?1').bind(id).run();
    await audit('board:deleted', 'board_message', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

async function setIncident(id: string, verified: 0 | 1, status: 'reviewing' | 'dismissed'): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db
        .prepare("UPDATE bangon_incidents SET verified = ?1, status = ?2, updated_at = datetime('now') WHERE id = ?3")
        .bind(verified, status, id)
        .run();
    await audit(verified ? 'incident:verified' : 'incident:dismissed', 'incident', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

export async function verifyIncident(id: string): Promise<void> {
    await setIncident(id, 1, 'reviewing');
}

export async function dismissIncident(id: string): Promise<void> {
    await setIncident(id, 0, 'dismissed');
}

// Undoes a verification — clears the verified flag and returns the report to
// the "Hazard & incident reports" review queue (status 'reviewing', not
// 'dismissed', so it stays visible to moderators). Distinct from dismiss
// (rejects out of the queue) and delete (drops the row).
export async function unverifyIncident(id: string): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db
        .prepare("UPDATE bangon_incidents SET verified = 0, status = 'reviewing', updated_at = datetime('now') WHERE id = ?1")
        .bind(id)
        .run();
    await audit('incident:unverified', 'incident', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

// Hard-deletes a report — for accidentally-verified or bogus reports.
export async function deleteIncident(id: string): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db.prepare('DELETE FROM bangon_incidents WHERE id = ?1').bind(id).run();
    await audit('incident:deleted', 'incident', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

// Marks an already-verified report as resolved ("cleared"). Stays verified so
// it remains on the public tab, just sorted below active ones and dimmed.
export async function resolveIncident(id: string): Promise<void> {
    await assertAdmin();
    const db = await getDb();
    await db
        .prepare("UPDATE bangon_incidents SET status = 'resolved', updated_at = datetime('now') WHERE id = ?1")
        .bind(id)
        .run();
    await audit('incident:resolved', 'incident', id);
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
}

// ── Incident activation (runtime standby↔active switch) ──────────────
// Declares an active incident: the homepage banner + command center flip to
// active immediately via revalidatePath — no redeploy. Persisted in D1
// (bangon_incident_state, single row), overriding the committed incident.json.
//
// Returns a result instead of throwing so a missing table (migration 0003 not
// applied to the remote D1) surfaces as an actionable message in the admin UI
// rather than a silent form failure — see docs/bangon-iligan.md troubleshooting.
export async function activateIncident(
    _prev: ActionResult,
    formData: FormData,
): Promise<ActionResult> {
    await assertAdmin();
    const title = String(formData.get('title') ?? '').trim();
    const summary = String(formData.get('summary') ?? '').trim();
    const declaredAt = String(formData.get('declaredAt') ?? '').trim();
    if (!title) return { success: false, error: 'A title is required to declare an incident.' };

    try {
        const db = await getDb();
        await db
            .prepare(
                `INSERT INTO bangon_incident_state (id, active, title, summary, declared_at, updated_at)
                 VALUES ('current', 1, ?1, ?2, ?3, datetime('now'))
                 ON CONFLICT (id) DO UPDATE SET
                    active = 1,
                    title = excluded.title,
                    summary = excluded.summary,
                    declared_at = excluded.declared_at,
                    updated_at = datetime('now')`,
            )
            .bind(title, summary, declaredAt)
            .run();
    } catch (err) {
        console.error('activateIncident failed:', err);
        return {
            success: false,
            error:
                'Could not save the incident state. If this persists, apply pending database ' +
                'migrations with `npm run db:migrate` (the bangon_incident_state table may be missing).',
        };
    }
    await audit('incident_state:activated', 'incident_state', 'current');
    revalidatePath('/');
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
    return { success: true };
}

// Stands the incident down — back to standby. Keeps the last title/summary in
// the row (hidden while inactive) so re-activating is one click. Bound via
// useActionState, which supplies (prevState, FormData); neither is needed here.
export async function deactivateIncident(): Promise<ActionResult> {
    await assertAdmin();
    try {
        const db = await getDb();
        await db
            .prepare("UPDATE bangon_incident_state SET active = 0, updated_at = datetime('now') WHERE id = 'current'")
            .run();
    } catch (err) {
        console.error('deactivateIncident failed:', err);
        return {
            success: false,
            error:
                'Could not stand down the incident. If this persists, apply pending database ' +
                'migrations with `npm run db:migrate` (the bangon_incident_state table may be missing).',
        };
    }
    await audit('incident_state:deactivated', 'incident_state', 'current');
    revalidatePath('/');
    revalidatePath('/bangon-iligan');
    revalidatePath('/bangon-iligan/admin');
    return { success: true };
}
