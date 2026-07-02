# Budget Visualizer — Design

> **Addendum (post-implementation):** the maintainer clarified via issue #29 that `/iligan` is
> reserved strictly for culture/heritage/city-profile content, and this feature should live under
> a new `/transparency` route instead — a dedicated hub for fiscal accountability and governance
> documents (budget, SALN, FOI, etc.). The page was moved to `app/transparency/budget/` and the
> nav entry to a new top-level "Transparency" section. All `/iligan/budget` references below are
> from the original design and are superseded by `/transparency/budget`; the data file itself
> stays at `data/iligan/budget.json` since that's about data organization, not routing.

## Problem

`data/iligan/city-profile.json` currently shows two flat rows — Revenue (2024): ₱3,031M and
Expenditure (2024): ₱3,367M — with no breakdown and no way to drill in. The README's roadmap
asks for "transparent, easy-to-read dashboards for public data ... or infrastructure projects."
No page currently does this.

## Data source

**BLGF "Statement of Receipts and Expenditures by LGU"** (Bureau of Local Government Finance,
Department of Finance), published annually at `blgf.gov.ph/lgu-fiscal-data/`, Public Domain
license, cataloged at `data.bettergov.ph` (dataset #9, same civic-tech family as this repo's
`@bettergov/kapwa` dependency).

Two fiscal years are currently published with a full per-LGU breakdown:
- `By-LGU-SRE-2024.xlsx` — FY2024 (Preliminary — the source file's own title cell reads "FY 2024 (Preliminary)"; BLGF has not published a superseding finalized per-LGU file for 2024 as of this writing)
- `By-LGU-SRE-2025.xlsx` — FY2025 (Preliminary)

Iligan City's row (row 215 in both files) was extracted and verified. FY2024's total current
operating income (₱3,062.86M) closely matches the existing `city-profile.json` figure
(₱3,031M), confirming that figure was sourced from the same dataset, just never broken down.

No per-LGU breakdown exists for years before 2024 (only regional/income-class aggregates) — the
trend starts at 2024 and grows by one year each time BLGF publishes a new annual file.

Note: `blgf.gov.ph` returns HTTP 403 to requests without a browser User-Agent header — the
extraction script must set one.

## Data shape

`data/iligan/budget.json`, validated by `validations/budgetSchema.ts`:

```ts
export const BudgetYearSchema = z.object({
  fiscalYear: z.number(),
  status: z.enum(['final', 'preliminary']),
  income: z.object({
    localTax: z.number(),
    localNonTax: z.number(),
    nationalTaxAllotment: z.number(), // IRA
    otherExternal: z.number(),
    total: z.number(),
  }),
  expenditure: z.object({
    generalPublicServices: z.number(),
    socialServices: z.number(),
    economicServices: z.number(),
    debtService: z.number(),
    total: z.number(),
  }),
  capitalOutlay: z.number(),
  netOperatingSurplus: z.number(),
});
export const BudgetSchema = z.object({
  currency: z.literal('PHP'),
  unit: z.literal('million'),
  years: z.array(BudgetYearSchema),
});
```

Figures are pre-converted to ₱ millions during extraction (matching the `"₱3,031M"` convention
already used in `city-profile.json`), not at render time. This curates BLGF's ~20 raw line
items down to headline categories appropriate for a citizen-facing page, not an accounting
export.

Seed data: both FY2024 and FY2025 rows, already extracted from the real BLGF files, ship with
the first PR — no placeholder data.

## Pipeline

Follows the existing repo convention exactly (see `data/government/departments/index.ts` for
the pattern already in use): static JSON, no runtime fetch, validated at build time.

```
scripts/extract-budget-data.mjs   (new — run manually, once a year, when BLGF publishes)
  -> downloads By-LGU-SRE-<year>.xlsx (needs a browser User-Agent; blgf.gov.ph 403s bare curl)
  -> finds Iligan City's row, maps raw columns -> curated schema
  -> writes/updates data/iligan/budget.json, appending the new year
  -> npm run build -> BudgetSchema.parse() fails the build if the edit is malformed
```

This script is a maintenance tool, not part of the request path — same category as a seed
script. It's committed so "add next year's data" becomes a 10-minute job instead of repeating
the source research done for this design.

## Page & components

`app/iligan/budget/page.tsx` + `BudgetClient.tsx`, following the `city-stats` page pattern.

- **Revenue composition** — donut (Recharts `PieChart`): Local Tax / Local Non-Tax / National
  Tax Allotment / Other External. Surfaces IRA-dependency, the single most citizen-relevant
  fiscal fact for a PH LGU.
- **Expenditure composition** — donut: General Public Services / Social Services / Economic
  Services / Debt Service.
- **Year-over-year trend** — grouped `BarChart`: Total Income vs Total Expenditure, 2024 vs
  2025, with the 2025 bar marked "Preliminary" (reusing the existing badge style seen on
  `/travel`'s "Under Construction" badge).
- **Headline stat cards** — reuse the existing `Card` / `GridStatSchema` pattern: Net Operating
  Surplus, Capital Outlay.
- Sources cited via the existing `components/ui/ReferencesFooter.tsx`, linking to
  `blgf.gov.ph/lgu-fiscal-data/`.

## Navigation & cross-links

- `data/navigation.json`: add a `"Budget & Finances"` entry to the `Iligan City` dropdown.
- `data/iligan/city-profile.json`'s "Revenue (2024)" row lives in `economy.grid`, typed by
  `GridStatSchema` (`validations/cityProfileSchema.ts`) — which has no `href` field today. The
  href pattern currently only exists on `FacilityStatSchema` (used by `infrastructure.facilities`,
  e.g. "Power generation" -> `/iligan/electricity#anchor`). This PR adds an optional `href` field
  to `GridStatSchema` (mirroring `FacilityStatSchema`'s), then sets
  `href: "/iligan/budget"` on the Revenue row only.
- "Expenditure (2024)" lives in `economy.commerce`, typed by `KeyValueRowSchema` — a plain
  key/value list used for many non-linkable facts across the schema. Adding href support there
  is out of scope for this PR; Expenditure stays as a flat figure for now.

## API

`app/api/v1/budget/route.ts` — same shape as the existing `services`/`departments`/`agencies`
routes: returns the validated `budget.json` with `meta.source` and cache headers. Add a fourth
endpoint block to `app/open-data/page.tsx`'s documentation, matching the existing three.

## Dependency

Adds `recharts` — the repo currently has no charting library. Chosen over hand-rolled SVG
charts because only 2-3 chart types are needed here and Recharts' built-in responsiveness,
tooltips, and accessibility outweigh the repo's general dependency-minimalism for this case.

## Testing

No test suite exists in this repo (no Jest/Vitest configured) — not introducing one solely for
this feature. Correctness is enforced by `BudgetSchema.parse()` at build time, which is already
run by the `pre-push` hook (`npm run build`), the same mechanism validating every other
data-driven page.

## Out of scope

- Historical years before 2024 (BLGF doesn't publish per-LGU breakdowns further back).
- Live/API-fetched data — this is annual static data, matching every other page except weather.
- A generic "any LGU" budget viewer — this is Iligan-specific, matching the rest of the site.
