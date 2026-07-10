// SERVER-ONLY — D1 read helpers for the Bangon Iligan surfaces.
//
// Every helper is defensive: if the D1 binding is unavailable (e.g. a preview
// build without the database attached) it logs and returns an empty result so
// the page still renders instead of 500-ing. Rows are parsed through the zod
// row schemas so malformed data never reaches the UI.
import { getDb } from "@/lib/db";
import {
    BoardMessageRowSchema,
    IncidentReportRowSchema,
    FeedRowSchema,
    IncidentStateRowSchema,
    type BoardMessageRow,
    type IncidentReportRow,
    type FeedRow,
    type IncidentStateRow,
} from "@/validations/bangonSchema";

// Approved community-board messages, newest first.
export async function getApprovedBoardMessages(limit = 50): Promise<BoardMessageRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_board_messages WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = BoardMessageRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getApprovedBoardMessages failed:", err);
        return [];
    }
}

// Partially masks a contact number for public display — keeps the first 4 and
// last 4 digits so it's recognizable without publishing the full number.
// Masking happens here (server-side) so the full number never reaches the
// public client payload; the admin queries keep the raw value.
function maskPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 8) return "•••";
    return `${digits.slice(0, 4)}•••${digits.slice(-4)}`;
}

// Verified incident/hazard reports for the public "Reports" tab. Active reports
// sort above resolved ("cleared") ones. Contact numbers are masked for the
// public; pass mask=false for the admin/inline-moderation view.
export async function getVerifiedIncidents(limit = 50, mask = true): Promise<IncidentReportRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_incidents WHERE verified = 1 ORDER BY (status = 'resolved') ASC, created_at DESC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = IncidentReportRowSchema.safeParse(row);
            if (!parsed.success) return [];
            return [mask ? { ...parsed.data, contact_number: maskPhone(parsed.data.contact_number) } : parsed.data];
        });
    } catch (err) {
        console.error("getVerifiedIncidents failed:", err);
        return [];
    }
}

// Ingested official-source feed items (earthquakes, advisories…), newest first.
export async function getFeedItems(limit = 30): Promise<FeedRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare("SELECT * FROM bangon_feed ORDER BY published_at DESC LIMIT ?1")
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = FeedRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getFeedItems failed:", err);
        return [];
    }
}

// ── Admin moderation reads ──────────────────────────────────────────
// Board messages awaiting moderation, oldest first (FIFO review queue).
export async function getPendingBoardMessages(limit = 100): Promise<BoardMessageRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_board_messages WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = BoardMessageRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getPendingBoardMessages failed:", err);
        return [];
    }
}

// Verified, still-active reports (not resolved/dismissed) — the admin's
// "mark resolved" queue. Keeps the full (unmasked) contact number.
export async function getActiveIncidents(limit = 100): Promise<IncidentReportRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_incidents WHERE verified = 1 AND status NOT IN ('resolved', 'dismissed') ORDER BY created_at ASC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = IncidentReportRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getActiveIncidents failed:", err);
        return [];
    }
}

// Incident/hazard reports awaiting verification, oldest first.
export async function getUnverifiedIncidents(limit = 100): Promise<IncidentReportRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_incidents WHERE verified = 0 AND status != 'dismissed' ORDER BY created_at ASC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = IncidentReportRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getUnverifiedIncidents failed:", err);
        return [];
    }
}

// Runtime incident-activation state (single row, id = 'current'). Returns null
// when the row / table / binding is unavailable, so callers fall back to the
// committed static config instead of 500-ing.
export async function getIncidentState(): Promise<IncidentStateRow | null> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare("SELECT * FROM bangon_incident_state WHERE id = 'current' LIMIT 1")
            .all();
        const row = (results ?? [])[0];
        if (!row) return null;
        const parsed = IncidentStateRowSchema.safeParse(row);
        return parsed.success ? parsed.data : null;
    } catch (err) {
        console.error("getIncidentState failed:", err);
        return null;
    }
}
