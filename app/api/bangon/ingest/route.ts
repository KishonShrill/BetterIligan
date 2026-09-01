import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { collectFeedItems } from "@/lib/bangon/feeds";

// POST /api/bangon/ingest — pulls trusted external feeds and upserts them into
// bangon_feed. Meant to be called on a schedule (GitHub Actions cron or a
// Cloudflare Cron worker). Guarded by INGEST_SECRET in production; in dev the
// guard is skipped so it can be curled locally.
//
// Auth: Authorization: Bearer <INGEST_SECRET>
export async function POST(request: Request) {
  const secret = process.env.INGEST_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Look back a week so a missed run still backfills.
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const items = await collectFeedItems(since);

    const db = await getDb();
    let upserted = 0;
    for (const it of items) {
      await db
        .prepare(
          `INSERT INTO bangon_feed (id, source, external_id, category, title, summary, url, magnitude, published_at)
                     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
                     ON CONFLICT (source, external_id) DO UPDATE SET
                        category = excluded.category,
                        title = excluded.title,
                        summary = excluded.summary,
                        url = excluded.url,
                        magnitude = excluded.magnitude,
                        published_at = excluded.published_at`,
        )
        .bind(
          crypto.randomUUID(),
          it.source,
          it.externalId,
          it.category,
          it.title,
          it.summary ?? null,
          it.url ?? null,
          it.magnitude ?? null,
          it.publishedAt,
        )
        .run();
      upserted++;
    }

    return NextResponse.json({ ok: true, fetched: items.length, upserted });
  } catch (err) {
    console.error("bangon ingest failed:", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
