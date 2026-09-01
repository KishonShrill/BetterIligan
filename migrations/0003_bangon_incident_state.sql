-- 0003_bangon_incident_state.sql
-- Runtime activation state for the Bangon Iligan standby↔active switch.
--
-- The `active` flag + active-incident summary used to live only in the committed
-- data/bangon/incident.json — a build-time import, so flipping it required an
-- edit + redeploy. This single-row table (id = 'current') moves that state into
-- D1 so a moderator can declare / stand down an incident from the /admin console
-- with no redeploy. The JSON stays as the seed/default; this row overrides
-- `active` + `activeIncident` at runtime.

CREATE TABLE IF NOT EXISTS bangon_incident_state (
    id          TEXT PRIMARY KEY DEFAULT 'current' CHECK (id = 'current'),
    active      INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0, 1)),
    title       TEXT NOT NULL DEFAULT '',
    summary     TEXT NOT NULL DEFAULT '',
    declared_at TEXT NOT NULL DEFAULT '',
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed the single state row (standby). Idempotent so re-applying is safe.
INSERT INTO bangon_incident_state (id, active) VALUES ('current', 0)
    ON CONFLICT (id) DO NOTHING;
