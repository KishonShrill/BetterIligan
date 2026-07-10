-- Bangon Iligan — live command-center datastore (Cloudflare D1 / SQLite).
--
-- Tables mirror the BangonGenSan reference surface, adapted to D1:
--   bangon_requests        crowd-sourced relief requests (food/water/etc.)
--   bangon_incidents       crowd-sourced incident reports
--   bangon_board_messages  public community message board (free-text, moderated)
--   bangon_audit_log       append-only moderation trail
--
-- The live "Reports" feed is derived by merging verified bangon_requests +
-- bangon_incidents (no dedicated table); the "Board" tab reads
-- bangon_board_messages. Together they back the two-tab live panel.
--
-- Conventions:
--   * Ids are app-generated (crypto.randomUUID()), stored as TEXT.
--   * Timestamps are ISO-8601 strings set by the app; the datetime('now')
--     defaults are a fallback only (they yield 'YYYY-MM-DD HH:MM:SS').
--   * Booleans are 0/1 INTEGERs (SQLite has no native boolean).
--   * CHECK constraints pin the closed value sets to match the zod schemas
--     in validations/bangonSchema.ts — keep the two in sync.

CREATE TABLE IF NOT EXISTS bangon_requests (
    id             TEXT PRIMARY KEY,
    need_type      TEXT NOT NULL CHECK (need_type IN ('food', 'water', 'medicine', 'shelter', 'rescue')),
    barangay       TEXT NOT NULL,
    landmark       TEXT,
    full_name      TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'fulfilled')),
    verified       INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bangon_requests_status  ON bangon_requests (status);
CREATE INDEX IF NOT EXISTS idx_bangon_requests_created ON bangon_requests (created_at);
-- Public surface reads only verified rows, newest first.
CREATE INDEX IF NOT EXISTS idx_bangon_requests_public  ON bangon_requests (verified, created_at);

CREATE TABLE IF NOT EXISTS bangon_incidents (
    id             TEXT PRIMARY KEY,
    incident_type  TEXT NOT NULL CHECK (incident_type IN ('natural_disaster', 'fire', 'medical', 'security', 'infrastructure', 'other')),
    barangay       TEXT NOT NULL,
    landmark       TEXT,
    description    TEXT NOT NULL,
    photo_url      TEXT,
    contact_number TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
    verified       INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bangon_incidents_status  ON bangon_incidents (status);
CREATE INDEX IF NOT EXISTS idx_bangon_incidents_created ON bangon_incidents (created_at);
CREATE INDEX IF NOT EXISTS idx_bangon_incidents_public  ON bangon_incidents (verified, created_at);

-- Public community board. Free-text posts are moderated: default 'pending',
-- only 'approved' rows surface publicly, 'hidden' rows are removed by an admin.
-- author_name / barangay are optional context; message is length-capped in the
-- zod input schema to blunt spam and abuse.
CREATE TABLE IF NOT EXISTS bangon_board_messages (
    id          TEXT PRIMARY KEY,
    message     TEXT NOT NULL,
    author_name TEXT,
    barangay    TEXT,
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bangon_board_status  ON bangon_board_messages (status);
CREATE INDEX IF NOT EXISTS idx_bangon_board_created ON bangon_board_messages (created_at);

CREATE TABLE IF NOT EXISTS bangon_audit_log (
    id          TEXT PRIMARY KEY,
    actor       TEXT NOT NULL,
    action      TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id   TEXT NOT NULL,
    detail      TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bangon_audit_entity  ON bangon_audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_bangon_audit_created ON bangon_audit_log (created_at);
