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
    type BoardMessageRow,
    type IncidentReportRow,
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

// Verified incident/hazard reports, newest first — the "Reports" feed tab.
export async function getVerifiedIncidents(limit = 50): Promise<IncidentReportRow[]> {
    try {
        const db = await getDb();
        const { results } = await db
            .prepare(
                "SELECT * FROM bangon_incidents WHERE verified = 1 ORDER BY created_at DESC LIMIT ?1",
            )
            .bind(limit)
            .all();
        return (results ?? []).flatMap((row) => {
            const parsed = IncidentReportRowSchema.safeParse(row);
            return parsed.success ? [parsed.data] : [];
        });
    } catch (err) {
        console.error("getVerifiedIncidents failed:", err);
        return [];
    }
}
