# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BetterIliganCity.org** is a volunteer-driven, open-source civic-tech portal for Iligan City, Philippines. It centralizes government services, public data, local heritage, and disaster-response resources.

It is a **Next.js 16 App Router** application that is **built and deployed via VINEXT** (a Cloudflare adapter layer) to **Cloudflare Workers + D1 (SQLite)**, with a fallback OpenNext/Vercel path also wired up. The site is styled with **Tailwind CSS v4**, uses **Lucide React** icons, and is typed with **TypeScript** (strict).

## Common Commands

All commands run via npm.

| Task                                                                         | Command                  |
| ---------------------------------------------------------------------------- | ------------------------ |
| **Start dev server** (applies local D1 migrations first)                     | `npm run dev`            |
| **Build for production** (runs `cf-typegen` as a prebuild step)              | `npm run build`          |
| **Start a local production preview** (applies persisted local D1 migrations) | `npm run start`          |
| **Deploy** (applies remote D1 migrations, then deploys)                      | `npm run deploy`         |
| **Lint** (ESLint 9 + `eslint-config-next`)                                   | `npm run lint`           |
| **Format code**                                                              | `npm run format`         |
| **Check formatting**                                                         | `npm run format:check`   |
| **Typegen Cloudflare types** (`cloudflare-env.d.ts`, runs on prebuild)       | `npm run cf-typegen`     |
| **Apply D1 migrations locally**                                              | `npm run db:migrate:dev` |
| **Apply D1 migrations to remote D1**                                         | `npm run db:migrate`     |
| **Generate OG images** (satori/sharp; runs in the pre-push hook)             | `npm run generate-og`    |

Notes:

- `npm run lint` is **non-blocking** in CI (`continue-on-error: true`) due to existing debt on main; the build and commitlint checks must still pass.
- The **pre-push hook** runs `npm run generate-og && npm run build`; the **pre-commit hook** runs prettier.
- **There is no test runner or test script** in this project. CI consists of lint + build + commitlint only.

## Architecture

The codebase follows a layered "data / logic / presentation" layout over the Next.js App Router.

### `app/` — Routes (App Router)

One folder per route. **Page components are Server Components** and fetch their data directly (no client fetches for core content). Client-only files carry `"use client"` at the top.

Data flow per page: **page.tsx (Server Component) → calls data/query helpers or imports static data → passes plain props to a Client Component (or `*Client.tsx`)**. This split keeps data fetching server-side and DOM interactivity client-side.

Key route groups:

- `app/api/` — Route Handlers. `api/v1/{services,departments,agencies,budget}` serve the validated static data as JSON (with `Cache-Control` headers). `api/bangon/ingest` is the feed ingester. `api/weather` proxies OpenWeatherMap.
- `app/bangon-iligan/` — The Bangon Iligan command center (see [Bangon Iligan](#bangon-iligan)).
- `app/disaster/` — Disaster preparedness hub (hotlines, facilities map, guides).
- `app/travel/`, `app/services/`, `app/transparency/`, `app/iligan/` — Content sections.

### `components/` — Reusable UI

- `components/ui/` — Primitives: `Card` (+ `CardHeader`/`CardContent`/`CardFooter`), `Section`, `Heading`, `Text`, `Breadcrumbs`, `ListItem`, `SubpageHero` (compound component), `SubpageNav`, `FilterGrid`/`FilterGridSidebar`, `ScrollToTop`, `Button3D`, `ContributionModal`, `ReferencesFooter`.
- `components/layout/` — `Header` (navigation + mobile drawer, hides on select paths), `TopBanner` (live weather + forex + emergency numbers), `Footer`.
- `components/modals/` — `FareCalculatorModal`, `ReportIssueModal`.
- Standalone domain components: `ServiceCard`, `BidCard`, `ResolutionCard`.

All components merge class names with the `cn()` helper (clsx + tailwind-merge) from `lib/utils`.

### `sections/` — Page composition blocks

Organized by page: `sections/homepage/` (Hero, Services, WeatherMap, CityStats, DonationSection, EmergencyHotlines, ReportIssue, ActiveIncidentBanner), `sections/homepage/` for the homepage, and per-feature sections (e.g. `app/disaster/*` local imports, `app/bangon-iligan/*` local modules). These are the building blocks a page composes rather than full routes.

### `data/` — Data sources (static + parsed)

Static JSON/YAML is loaded, then **validated through Zod at import time**. These are **server-only modules** — importing them from a `"use client"` component bundles the full payload + zod into the client build (a noted footgun).

- `data/services/` — Per-category JSON (`business.json`, `certificates.json`, …) combined and validated by `index.ts` → `allServices`. A discriminated-union `ServiceSchema` (`type`: `standard` | `external` | `internal` | `custom_link`) drives rendering.
- `data/bangon/` — `incident.json` (standby/active config), `index.ts` (parses config), `queries.ts` (D1 read helpers), `state.ts` (runtime overlay of D1 onto static config).
- `data/disaster/` — hotlines, guides, facilities (validated).
- `data/government/` — departments + national agencies.
- `data/iligan/` — city stats, budget, officials, barangays, bids, resolutions.
- `data/travel/` — bus fares, rural transit schedules, waterfalls.
- `data/categories.ts` — `serviceCategories` (used for the services index) and `headerDropdown` (header nav).
- `data/navigation.json` — top-level nav config consumed by `Header.tsx`.

### `lib/` — Server-only utilities

- `lib/db.ts` — `getDb()`: returns the Cloudflare D1 `DB` binding (from `cloudflare:workers` env). Throws a clear error if unbound. All D1 access routes through this.
- `lib/bangonAuth.ts` — Single shared-secret admin auth: HMAC-signed HttpOnly session cookie (no DB). `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`.
- `lib/bangon/feeds.ts` — Feed adapters for the ingester (USGS earthquakes, extensible to PAGASA/NDRRMC). `collectFeedItems()` runs all adapters with `Promise.allSettled`.
- `lib/utils.ts` — `cn()` (className merge), `formatDate`, `safeJsonLd` (escapes `<` for safe JSON-LD injection), `getCategoryStyles`.

### `actions/` — Server Actions (`"use server"`)

Next.js server actions for mutations:

- `actions/bangon.ts` — `postBoardMessage`, `submitHazardReport` (public, rate-limited + reCAPTCHA, write to D1).
- `actions/bangonAdmin.ts` — Moderation: approve/hide/delete board messages; verify/dismiss/resolve/delete incidents; `activateIncident`/`deactivateIncident` (the runtime standby↔active switch). Each mutation is auth-guarded, audit-logged, and revalidates affected paths.
- `actions/contribute.ts` — `submitContribution` (sends to Discord webhook).

### `validations/` — Zod schemas

Every domain has schemas. **Two-layer convention**: an `*InputSchema` validates untrusted form/ingest input; a `*RowSchema` validates D1 rows read back before they reach the UI ("parse at the boundary"). CHECK constraints in `migrations/*` are kept in sync with the schema enums. Key files: `bangonSchema.ts`, `serviceSchema.ts`, `disasterSchema.ts`, `budgetSchema.ts`, `bidSchema.ts`, `resolutionSchema.ts`, `agencySchema.ts`, `cityProfileSchema.ts`, `waterfallSchema.ts`, `assistanceSchema.ts`.

### `utils/` — Pure helpers

- `utils/fareCalculator.ts` — LTFRB bus-fare math (base km, regular/discounted rates, nearest-0.25 rounding).
- `utils/variables.ts` — `HIDDEN_HEADER_PATHS` (full-screen routes like `/bangon-iligan`, `/travel/transportation/map`, jeepney), `ROUTE_DIRECTORY_CODES`.

### `types/` — Shared TypeScript types (e.g. `types/weather.ts`).

### `migrations/` — Cloudflare D1 migrations

Sequential SQL migrations applied via `npm run db:migrate:dev` (local) / `db:migrate` (remote). `npm run deploy` runs migrations first, so production can never be missing a table.

1. `0001_bangon.sql` — Core incident/board/audit tables.
2. `0002_bangon_feed.sql` — Ingested official-alert feed (`bangon_feed`), unique on `(source, external_id)`.
3. `0003_bangon_incident_state.sql` — Single-row runtime activation state (overrides `data/bangon/incident.json`).

### `scripts/` — `generate-og-images.tsx` (satori/sharp OG generation; invoked by pre-push).

## Key Conventions

- **Validate at every boundary.** Static data is parsed through Zod at import; D1 rows are parsed through Row schemas in `data/bangon/queries.ts`; form submissions through Input schemas in `actions/`. Don't trust raw DB/JSON output reaching JSX.
- **Server components fetch; client components render interactivity.** Page `page.tsx` files are Server Components and call D1/JSON directly. Move only UI state (`useState`/`useEffect`) into `"use client"` components — typically a `*Client.tsx` sibling.
- **D1 access goes through `getDb()`** (`lib/db.ts`). Read helpers live in `data/bangon/queries.ts`; writes happen in `actions/`.
- **`cn()` everywhere** for class composition (`clsx` + `tailwind-merge`).
- **JSON-LD**: inject via `safeJsonLd()` (escapes `<` to prevent `</script>` injection), not raw `JSON.stringify`.
- **Path aliases**: `@/*` maps to `/`. Import `lucide-react` icons, not inline SVGs, for consistency.
- **Component reuse**: prefer `components/ui/` primitives (`Section`, `Card`, `Heading`, `SubpageHero`, `SubpageNav`) over raw divs — see CONTRIBUTING.md.
- **Commit messages** are enforced by `commitlint` (conventional commits) via the `commit-msg` hook; PR titles use the `[<prefix>: title]` form. See CONTRIBUTING.md.

## Bangon Iligan (Command Center)

A full-screen operational map at `/bangon-iligan` that stays on **standby** day-to-day and flips to a live disaster-response surface when activated. See `docs/bangon-iligan.md` for the deep feature reference.

- **Standby ↔ active switch**: static default in `data/bangon/incident.json` is overlaid at runtime by the single-row D1 table `bangon_incident_state` (`getEffectiveBangonConfig()` in `data/bangon/state.ts`). A moderator toggles it from `/bangon-iligan/admin` — no redeploy. `revalidatePath` refreshes the homepage banner + command center immediately.
- **Admin auth**: shared-secret `ADMIN_PASSWORD` → signed HttpOnly cookie (`lib/bangonAuth.ts`). Dev fallback is `iligan-admin-dev`; production requires the env var.
- **Moderation**: inline on the public panel for signed-in moderators; full console at `/bangon-iligan/admin`. Rejection semantics matter: "Unverify"/"Un-publish" **return to the review queue**; "Dismiss"/"Hide" reject; "Delete" hard-removes. See `docs/bangon-iligan.md` §4.
- **Feed ingester**: cron (GitHub Actions `bangon-ingest.yml`, every 30 min) → `POST /api/bangon/ingest` → `collectFeedItems()` → upsert into `bangon_feed` (idempotent via `ON CONFLICT (source, external_id)`). Guarded by `INGEST_SECRET` in production. To add a source, drop a new adapter into `lib/bangon/feeds.ts` and register it in `collectFeedItems()` — no schema/migration change needed.
- **Troubleshooting**: if "Activate incident" does nothing, migration `0003` is missing on the remote D1 — run `npm run db:migrate` or redeploy.

## Environment

Secrets/local config live in `.env` (gitignored; committed template is `.env.example` when present). The repo's `.env` carries dev-only defaults.

| Variable                                  | Purpose                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Bangon moderator auth. Required in prod.                                               |
| `INGEST_SECRET`                           | Guards `POST /api/bangon/ingest` (Bearer token).                                       |
| `BANGON_INGEST_URL`                       | Cron target URL (dev convenience).                                                     |
| `NEXT_PUBLIC_WEATHER_CITY_ID`             | OpenWeather city id (1711082 = Iligan).                                                |
| `OPENWEATHER_API_KEY`                     | Weather proxy (commented in `.env`).                                                   |
| `RECAPTCHA_SECRET_KEY`                    | If set, `actions/bangon.ts` + modal verify captcha; if absent, dev skips verification. |
| `DISCORD_WEBHOOK_URL`                     | Where `actions/contribute.ts` posts.                                                   |
| `DEVELOPMENT_IP`                          | Allows non-localhost origins in `next.config.ts` dev.                                  |

Typegen for the Cloudflare `env` interface runs automatically via the `prebuild` hook (`npm run cf-typegen`), writing `cloudflare-env.d.ts`.
