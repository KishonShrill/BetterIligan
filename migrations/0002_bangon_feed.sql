-- Bangon Iligan — ingested official-source feed (earthquakes, advisories…).
--
-- Populated by the ingestion route (/api/bangon/ingest), which pulls from
-- external adapters (USGS earthquakes to start) and upserts here. Distinct from
-- the crowd-sourced bangon_incidents / bangon_board_messages: these rows come
-- from trusted feeds, keyed by (source, external_id) for idempotent re-ingest.

CREATE TABLE IF NOT EXISTS bangon_feed (
    id           TEXT PRIMARY KEY,
    source       TEXT NOT NULL,
    external_id  TEXT NOT NULL,
    category     TEXT NOT NULL,
    title        TEXT NOT NULL,
    summary      TEXT,
    url          TEXT,
    magnitude    REAL,
    published_at TEXT NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_bangon_feed_published ON bangon_feed (published_at);
