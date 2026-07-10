'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createAdminSession, destroyAdminSession, isAdmin } from '@/lib/bangonAuth';

type ActionResult = { success: true } | { success: false; error: string };

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
