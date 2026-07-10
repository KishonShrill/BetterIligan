# Bangon Iligan — Community Relief Command Center

A full-screen operational map at [`/bangon-iligan`](../app/bangon-iligan/page.tsx) that stays on
**standby** day-to-day and flips to a live disaster-response surface when needed. It reuses the
`/disaster` facilities map + hotlines and adds three crowd/official data layers backed by
**Cloudflare D1**: hazard reports, a moderated community board, and an ingested official-alerts feed.

This doc is for newcomers to the feature and for anyone adding a new **feed adapter**.

---

## 1. Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/bangon-iligan` | [`page.tsx`](../app/bangon-iligan/page.tsx) → [`BangonCommandCenter.tsx`](../app/bangon-iligan/BangonCommandCenter.tsx) | Public command center: full-viewport map + floating live-feed panel (Alerts / Reports / Board tabs). |
| `/bangon-iligan/admin` | [`admin/page.tsx`](../app/bangon-iligan/admin/page.tsx) | Moderation console (also available inline on the public panel when signed in). |
| `/bangon-iligan/admin/login` | [`admin/login/page.tsx`](../app/bangon-iligan/admin/login/page.tsx) | Shared-secret moderator login. |
| `POST /api/bangon/ingest` | [`api/bangon/ingest/route.ts`](../app/api/bangon/ingest/route.ts) | Pulls official feeds and upserts them into `bangon_feed`. Called on a schedule. |

The global header/footer are hidden on `/bangon-iligan` (same as `/travel/transportation`).

## 2. Standby ↔ active switch

Driven by [`data/bangon/incident.json`](../data/bangon/incident.json)'s `active` flag (parsed via
`BangonConfigSchema`). When `active` is `false` the page shows a preparedness/standby surface and the
incident banner + donation channels stay hidden — which is why their placeholder `TODO`s never reach
the public UI. Flip `active` to `true` (and fill the incident summary + donation channels) to go live.

## 3. Data model (Cloudflare D1, binding `DB`)

Tables created by the migrations in [`migrations/`](../migrations). Access goes through
[`lib/db.ts`](../lib/db.ts) (`getDb()`); reads are validated by the zod row schemas in
[`validations/bangonSchema.ts`](../validations/bangonSchema.ts) so malformed rows never reach the UI.

| Table | Migration | What it holds |
| --- | --- | --- |
| `bangon_incidents` | `0001` | Crowd-sourced hazard/incident reports. |
| `bangon_board_messages` | `0001` | Community-board posts. |
| `bangon_audit_log` | `0001` | Append-only moderation trail (best-effort; a logging failure never blocks the action). |
| `bangon_feed` | `0002` | Ingested official alerts (earthquakes, etc.). Unique on `(source, external_id)`. |

### State machines

**Incidents** — `verified` (0/1) × `status` (`open` / `reviewing` / `resolved` / `dismissed`):

| Public "Reports" tab shows | `WHERE verified = 1` (active sorted above `resolved`, which render dimmed + struck-through) |
| Admin "Hazard & incident reports" (review queue) | `WHERE verified = 0 AND status != 'dismissed'` |

**Board messages** — `status` (`pending` / `approved` / `hidden`):

| Public "Board" tab shows | `WHERE status = 'approved'` |
| Admin review queue | `WHERE status = 'pending'` |

Contact numbers are **masked server-side** (`0917•••4567`) before reaching the public payload; the
admin/inline-moderation reads keep the raw number.

## 4. Moderation actions

All live in [`actions/bangonAdmin.ts`](../actions/bangonAdmin.ts), each guarded by `assertAdmin()` and
audit-logged. The key distinction is **reject vs. send-back-to-review vs. hard-delete**:

| Entity | Action | Effect | Where it lands |
| --- | --- | --- | --- |
| Incident | Verify | `verified=1, status='reviewing'` | Public Reports tab |
| Incident | Unverify | `verified=0, status='reviewing'` | **Back in the review queue** |
| Incident | Dismiss | `verified=0, status='dismissed'` | Rejected (out of the queue) |
| Incident | Resolve | `status='resolved'` (stays verified) | Public, dimmed as "Cleared" |
| Incident | Delete | row removed | — |
| Board | Approve | `status='approved'` | Public Board tab |
| Board | Un-publish | `status='pending'` | **Back in the review queue** |
| Board | Hide | `status='hidden'` | Rejected (out of the queue) |
| Board | Delete | row removed | — |

> **Note:** *Unverify* / *Un-publish* return an item to the pending review queue — they are **not**
> the same as *Dismiss* / *Hide* (reject) or *Delete* (hard-remove).

Moderators moderate **inline** on the public panel (no `/admin` round-trip): when signed in, the panel
shows the pending queues with count badges, full contacts, and the action buttons above.

## 5. Auth

Single `ADMIN_PASSWORD` grants a signed, HttpOnly session cookie — no user accounts, no DB
([`lib/bangonAuth.ts`](../lib/bangonAuth.ts)). Designed to be swapped for Cloudflare Access later.

| Env var | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Moderator password (required in production). Dev fallback: `iligan-admin-dev`. |
| `ADMIN_SESSION_SECRET` | HMAC key for the cookie. Falls back to `ADMIN_PASSWORD`, then a dev-only default. |

## 6. The feed ingester

Flow: **cron → `POST /api/bangon/ingest` → `collectFeedItems()` → upsert into `bangon_feed` → Alerts tab.**

- [`lib/bangon/feeds.ts`](../lib/bangon/feeds.ts) — one **adapter** per source. Each returns normalized
  `FeedItem[]`. `collectFeedItems()` runs every adapter with `Promise.allSettled`, so one bad source
  never blocks the others.
- [`api/bangon/ingest/route.ts`](../app/api/bangon/ingest/route.ts) — `INGEST_SECRET`-guarded
  (`Authorization: Bearer <INGEST_SECRET>`; skipped in dev). Upserts each item with
  `ON CONFLICT (source, external_id) DO UPDATE`, so **re-ingesting is idempotent**.
- [`.github/workflows/bangon-ingest.yml`](../.github/workflows/bangon-ingest.yml) — cron every 30 min.
  No-ops until `BANGON_INGEST_URL` + `INGEST_SECRET` repo secrets are set.

### Adding a new adapter (PAGASA, NDRRMC, Facebook Graph, …)

1. In `lib/bangon/feeds.ts`, write `async function fetchX(sinceIso: string): Promise<FeedItem[]>`.
   Fetch the source, map each entry to a `FeedItem`, and validate it through `FeedItemSchema.safeParse`
   (drop anything that fails). The `fetchUsgsEarthquakes` adapter is the template.
2. A `FeedItem` is:

   | field | notes |
   | --- | --- |
   | `source` | stable string unique to the adapter, e.g. `"pagasa"` |
   | `externalId` | stable per-item id from the source — the dedupe key with `source` |
   | `category` | short label shown as the alert pill, e.g. `"Earthquake"`, `"Typhoon"` |
   | `title` | one-line headline |
   | `summary?` `url?` `magnitude?` | optional |
   | `publishedAt` | ISO 8601 string |

3. Add it to the `adapters` array in `collectFeedItems()`. Done — the route handles upsert/dedupe and
   the Alerts tab renders it. No schema or migration change needed as long as you reuse `bangon_feed`.

> Keep `source + externalId` stable across runs, or the upsert will insert duplicates instead of
> updating in place.

## 7. First-time deploy / setup

1. `npx wrangler d1 create betteriligan-bangon` → paste the id into
   [`wrangler.jsonc`](../wrangler.jsonc) (`d1_databases[0].database_id`).
2. `npx wrangler d1 migrations apply betteriligan-bangon` (add `--local` for dev) — applies `0001` + `0002`.
3. Set `ADMIN_PASSWORD` (and optionally `ADMIN_SESSION_SECRET`) for moderator login.
4. To activate the ingest cron, set repo secrets `BANGON_INGEST_URL` (the deployed
   `/api/bangon/ingest`) and `INGEST_SECRET`, and set the same `INGEST_SECRET` as a Cloudflare Worker
   env var so the route can verify the cron's requests.
5. (Optional) Kick the ingester once:
   `curl -X POST <BANGON_INGEST_URL> -H "Authorization: Bearer <INGEST_SECRET>"`.
