# Budget Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/iligan/budget` page showing Iligan City's revenue and expenditure breakdown (FY2024 + FY2025) as charts, sourced from BLGF's official per-LGU Statement of Receipts and Expenditures.

**Architecture:** Fully static — no backend, no live fetch. A one-time extraction script produces `data/iligan/budget.json`, validated by a Zod schema at import time (the same pattern every other data-driven page in this repo already uses). A client component renders it with Recharts. An API route re-serves the same validated JSON, matching the existing `/api/v1/*` endpoints.

**Tech Stack:** Next.js 16 (App Router), Zod, Recharts (new dependency), Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-07-02-budget-visualizer-design.md`

> **Addendum (post-implementation):** per maintainer guidance on issue #29, the page was moved
> from `app/iligan/budget/` to `app/transparency/budget/` after this plan was executed — `/iligan`
> is reserved for culture/heritage/city-profile content only. Every `/iligan/budget` reference in
> the tasks below reflects the original plan; the live route is `/transparency/budget`.
> `data/iligan/budget.json` is unaffected — that's the data file's location, not a route.

---

### Task 1: Add the `recharts` dependency

**Files:**
- Modify: `package.json:16-28` (the `"dependencies"` block)

- [ ] **Step 1: Add the dependency**

In the `"dependencies"` block (starts `package.json:16`), add `recharts` alphabetically between `"react-leaflet"` and `"tailwind-merge"`:

```json
        "react-leaflet": "^5.0.0",
        "recharts": "^2.15.0",
        "tailwind-merge": "^3.6.0",
```

- [ ] **Step 2: Install**

Run: `cd ~/Projects/BetterIligan && npm install`
Expected: `package-lock.json` updates, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add recharts for budget visualizer charts"
```

---

### Task 2: Add the budget Zod schema

**Files:**
- Create: `validations/budgetSchema.ts`

- [ ] **Step 1: Write the schema**

```ts
import { z } from 'zod';

export const BudgetYearSchema = z.object({
    fiscalYear: z.number().int(),
    status: z.enum(['final', 'preliminary']),
    income: z.object({
        localTax: z.number().nonnegative(),
        localNonTax: z.number().nonnegative(),
        nationalTaxAllotment: z.number().nonnegative(),
        otherExternal: z.number().nonnegative(),
        total: z.number().nonnegative(),
    }),
    expenditure: z.object({
        generalPublicServices: z.number().nonnegative(),
        socialServices: z.number().nonnegative(),
        economicServices: z.number().nonnegative(),
        debtService: z.number().nonnegative(),
        total: z.number().nonnegative(),
    }),
    capitalOutlay: z.number().nonnegative(),
    netOperatingSurplus: z.number(),
});

export const BudgetSchema = z.object({
    currency: z.literal('PHP'),
    unit: z.literal('million'),
    years: z.array(BudgetYearSchema),
});

export type BudgetYear = z.infer<typeof BudgetYearSchema>;
export type BudgetData = z.infer<typeof BudgetSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add validations/budgetSchema.ts
git commit -m "feat: add budget data schema"
```

---

### Task 3: Seed real budget data

**Files:**
- Create: `data/iligan/budget.json`

These figures were extracted and verified from BLGF's official `By-LGU-SRE-2024.xlsx` and `By-LGU-SRE-2025.xlsx` (Iligan City row, both files), converted from raw pesos to ₱ millions. See the spec doc for source links and the verification cross-check against the existing `city-profile.json` Revenue figure.

- [ ] **Step 1: Write the seed file**

```json
{
    "currency": "PHP",
    "unit": "million",
    "years": [
        {
            "fiscalYear": 2024,
            "status": "preliminary",
            "income": {
                "localTax": 629.63,
                "localNonTax": 212.03,
                "nationalTaxAllotment": 2190.90,
                "otherExternal": 30.30,
                "total": 3062.86
            },
            "expenditure": {
                "generalPublicServices": 1657.67,
                "socialServices": 327.58,
                "economicServices": 570.13,
                "debtService": 2.50,
                "total": 2557.88
            },
            "capitalOutlay": 311.74,
            "netOperatingSurplus": 504.98
        },
        {
            "fiscalYear": 2025,
            "status": "preliminary",
            "income": {
                "localTax": 831.82,
                "localNonTax": 238.20,
                "nationalTaxAllotment": 2599.10,
                "otherExternal": 44.61,
                "total": 3713.73
            },
            "expenditure": {
                "generalPublicServices": 1605.49,
                "socialServices": 394.01,
                "economicServices": 643.45,
                "debtService": 0.18,
                "total": 2643.12
            },
            "capitalOutlay": 354.56,
            "netOperatingSurplus": 1070.61
        }
    ]
}
```

- [ ] **Step 2: Verify it parses**

This repo has no test runner, so validation happens via a throwaway script (mirrors how `npm run build` is the real gate here):

Run:
```bash
cd ~/Projects/BetterIligan && npx tsx -e "
import { BudgetSchema } from './validations/budgetSchema';
import data from './data/iligan/budget.json';
console.log(BudgetSchema.parse(data).years.length, 'years OK');
"
```
Expected: `2 years OK`. If `tsx` isn't available, run `npx --yes tsx@latest ...` instead.

- [ ] **Step 3: Commit**

```bash
git add data/iligan/budget.json
git commit -m "feat: seed FY2024-2025 Iligan City budget data from BLGF SRE"
```

---

### Task 4: Add the annual extraction script

**Files:**
- Create: `scripts/extract-budget-data.mjs`

This is a maintenance tool, run manually once a year when BLGF publishes the next `By-LGU-SRE-<year>.xlsx`. It is not part of the build or request path.

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// Re-run this once a year when BLGF publishes a new By-LGU-SRE-<year>.xlsx at
// https://blgf.gov.ph/lgu-fiscal-data/ (also cataloged at data.bettergov.ph, dataset #9).
//
// Usage: node scripts/extract-budget-data.mjs <fiscalYear> <status: final|preliminary> <xlsxUrl>
// Example:
//   node scripts/extract-budget-data.mjs 2026 preliminary \
//     https://blgf.gov.ph/wp-content/uploads/2027/05/By-LGU-SRE-2026.xlsx
//
// blgf.gov.ph rejects requests without a browser User-Agent (403), so this script sets one.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ExcelJS from 'exceljs';

const [, , fiscalYearArg, statusArg, xlsxUrl] = process.argv;

if (!fiscalYearArg || !statusArg || !xlsxUrl) {
    console.error('Usage: node scripts/extract-budget-data.mjs <fiscalYear> <final|preliminary> <xlsxUrl>');
    process.exit(1);
}

const fiscalYear = Number(fiscalYearArg);
const status = statusArg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const budgetJsonPath = path.join(__dirname, '../data/iligan/budget.json');

const IILIGAN_ROW = 215; // Confirmed for FY2024/FY2025 files; verify column D ("LGU NAME") still reads "Iligan City" for new years.

async function main() {
    const res = await fetch(xlsxUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Referer': 'https://blgf.gov.ph/lgu-fiscal-data/',
        },
    });
    if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    const row = sheet.getRow(IILIGAN_ROW);
    const lguName = row.getCell(4).value;
    if (String(lguName).trim() !== 'Iligan City') {
        throw new Error(`Row ${IILIGAN_ROW} is "${lguName}", not "Iligan City" — BLGF likely re-sorted the sheet. Find the correct row manually.`);
    }

    const val = (col) => Number(row.getCell(col).value ?? 0) / 1_000_000; // pesos -> millions

    const entry = {
        fiscalYear,
        status,
        income: {
            localTax: round2(val(11)),
            localNonTax: round2(val(16)),
            nationalTaxAllotment: round2(val(18)),
            otherExternal: round2(val(19) + val(20) + val(21)),
            total: round2(val(23)),
        },
        expenditure: {
            generalPublicServices: round2(val(24)),
            socialServices: round2(val(30)),
            economicServices: round2(val(31)),
            debtService: round2(val(32)),
            total: round2(val(33)),
        },
        capitalOutlay: round2(val(47)),
        netOperatingSurplus: round2(val(34)),
    };

    const current = JSON.parse(readFileSync(budgetJsonPath, 'utf-8'));
    const years = current.years.filter((y) => y.fiscalYear !== fiscalYear);
    years.push(entry);
    years.sort((a, b) => a.fiscalYear - b.fiscalYear);
    current.years = years;

    writeFileSync(budgetJsonPath, JSON.stringify(current, null, 4) + '\n');
    console.log(`Updated data/iligan/budget.json with FY${fiscalYear} (${status}).`);
    console.log('Run `npm run build` to confirm it still validates against validations/budgetSchema.ts.');
}

function round2(n) {
    return Math.round(n * 100) / 100;
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
```

- [ ] **Step 2: Add the `exceljs` dev dependency**

The script needs an xlsx reader; add it as a dev dependency since it only runs manually, never at build/runtime:

```json
        "eslint-config-next": "16.2.6",
        "exceljs": "^4.4.0",
        "husky": "^9.1.7",
```

(insert into `"devDependencies"` in `package.json`, alphabetically after `eslint-config-next`)

Run: `npm install`

- [ ] **Step 3: Verify the script runs against the real FY2025 file** (proves the column mapping is still correct)

Run:
```bash
node scripts/extract-budget-data.mjs 2025 preliminary "https://blgf.gov.ph/wp-content/uploads/2026/05/By-LGU-SRE-2025.xlsx"
git diff data/iligan/budget.json
```
Expected: no diff (or only floating-point noise in the last decimal) — the script should reproduce the FY2025 entry already seeded in Task 3. If it doesn't reproduce, fix the column indices before proceeding.

Run `git checkout data/iligan/budget.json` afterward to discard any noise from the re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/extract-budget-data.mjs package.json package-lock.json
git commit -m "feat: add annual budget data extraction script"
```

---

### Task 5: Link the existing Revenue figure to the new page

**Files:**
- Modify: `validations/cityProfileSchema.ts:16-20` (`GridStatSchema`)
- Modify: `data/iligan/city-profile.json` (economy.grid → "Revenue (2024)" entry)

- [ ] **Step 1: Add optional `href` to `GridStatSchema`**

In `validations/cityProfileSchema.ts`, find:

```ts
export const GridStatSchema = z.object({
    label: z.string(),
    value: z.string(),
    subtext: z.string().optional(), // Optional since revenue/assets don't always have it
});
```

Replace with:

```ts
export const GridStatSchema = z.object({
    label: z.string(),
    value: z.string(),
    subtext: z.string().optional(), // Optional since revenue/assets don't always have it
    href: z.string().optional(),
});
```

- [ ] **Step 2: Add the link to the Revenue row**

In `data/iligan/city-profile.json`, inside `economy.grid`, find the `"Revenue (2024)"` entry:

```json
            {
                "label": "Revenue (2024)",
                "value": "₱3,031M",
                "subtext": "2024 · $1.36B USD"
            },
```

Wait — check the actual file: the real entry has no `subtext`. Confirm by reading the file first, then add `href` only:

```json
            {
                "label": "Revenue (2024)",
                "value": "₱3,031M",
                "href": "/iligan/budget"
            },
```

- [ ] **Step 3: Wire the link into `CityStatsClient.tsx`**

The economy tab (`app/iligan/city-stats/CityStatsClient.tsx:186-194`) currently renders `economy.grid` as plain `<div>`s. Change the mapped element to a `Link` when `href` is present, following the exact same conditional pattern already used for `infrastructure.facilities` at line 245:

```tsx
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {cityData.economy.grid.map((stat, idx) => {
                                    const Wrapper = stat.href ? Link : 'div';
                                    return (
                                        <Wrapper key={idx} {...(stat.href ? { href: stat.href } : {})} className={`bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5 block ${stat.href && 'hover:border-[#185FA5] transition-colors'}`}>
                                            <div className="text-[11px] text-[#185FA5] font-medium mb-0.5">{stat.label}</div>
                                            <div className="text-[22px] font-bold text-slate-900 leading-tight">{stat.value}</div>
                                            {stat.subtext && <div className="text-[11px] text-slate-500 mt-1">{stat.subtext}</div>}
                                        </Wrapper>
                                    );
                                })}
                            </div>
```

(`Link` is already imported at `CityStatsClient.tsx:4`.)

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds — confirms `GridStatSchema.parse()` still accepts `city-profile.json` with the new `href` field.

- [ ] **Step 5: Commit**

```bash
git add validations/cityProfileSchema.ts data/iligan/city-profile.json app/iligan/city-stats/CityStatsClient.tsx
git commit -m "feat: link Revenue stat card to the new budget page"
```

---

### Task 6: Build the budget page

**Files:**
- Create: `app/iligan/budget/page.tsx`
- Create: `app/iligan/budget/BudgetClient.tsx`

- [ ] **Step 1: Write `BudgetClient.tsx`**

```tsx
'use client'

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import Section from '@/components/ui/Section';
import SubpageHero from '@/components/ui/SubpageHero';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

import { BudgetSchema, BudgetData } from '@/validations/budgetSchema';
import rawBudgetData from '@/data/iligan/budget.json';

const budgetData: BudgetData = BudgetSchema.parse(rawBudgetData);

const PESO = (millions: number) => `₱${millions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}M`;

const INCOME_COLORS = ['#185FA5', '#378ADD', '#85B7EB', '#B5D4F4'];
const EXPENDITURE_COLORS = ['#042C53', '#0C447C', '#185FA5', '#378ADD'];

export default function BudgetClient() {
    const latest = budgetData.years[budgetData.years.length - 1];

    const incomeBreakdown = [
        { name: 'National Tax Allotment (IRA)', value: latest.income.nationalTaxAllotment },
        { name: 'Local Tax Revenue', value: latest.income.localTax },
        { name: 'Local Non-Tax Revenue', value: latest.income.localNonTax },
        { name: 'Other External Sources', value: latest.income.otherExternal },
    ];

    const expenditureBreakdown = [
        { name: 'General Public Services', value: latest.expenditure.generalPublicServices },
        { name: 'Economic Services', value: latest.expenditure.economicServices },
        { name: 'Social Services', value: latest.expenditure.socialServices },
        { name: 'Debt Service', value: latest.expenditure.debtService },
    ];

    const trend = budgetData.years.map((y) => ({
        year: y.status === 'preliminary' ? `${y.fiscalYear} (Prelim.)` : String(y.fiscalYear),
        Income: y.income.total,
        Expenditure: y.expenditure.total,
    }));

    const budgetReferences = [
        {
            title: 'Bureau of Local Government Finance — Statement of Receipts and Expenditures by LGU (FY2024 and FY2025, both Preliminary)',
            url: 'https://blgf.gov.ph/lgu-fiscal-data/',
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <SubpageHero className="bg-linear-to-r from-primary-700 to-primary-600 rounded-b-3xl">
                <SubpageHero.Badges>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#185FA5] text-[#85B7EB] bg-[#0C447C]">
                        Fiscal Year {latest.fiscalYear} {latest.status === 'preliminary' && '· Preliminary'}
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title className="text-white">Budget & Finances</SubpageHero.Title>
                <SubpageHero.Description className="text-[#85B7EB]">
                    Where Iligan City&apos;s money comes from and where it goes, sourced directly from the
                    Bureau of Local Government Finance&apos;s official annual reports.
                </SubpageHero.Description>
            </SubpageHero>

            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-8">
                    <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                        <div className="text-[11px] text-[#185FA5] font-medium mb-0.5">Net Operating Surplus</div>
                        <div className="text-[22px] font-bold text-slate-900 leading-tight">{PESO(latest.netOperatingSurplus)}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Income minus expenditure, FY{latest.fiscalYear}</div>
                    </div>
                    <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                        <div className="text-[11px] text-[#185FA5] font-medium mb-0.5">Capital Outlay</div>
                        <div className="text-[22px] font-bold text-slate-900 leading-tight">{PESO(latest.capitalOutlay)}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Spent on infrastructure and equipment, FY{latest.fiscalYear}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-8">
                    <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5">
                            Revenue composition
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={incomeBreakdown} dataKey="value" nameKey="name" outerRadius={100} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {incomeBreakdown.map((entry, idx) => (
                                        <Cell key={entry.name} fill={INCOME_COLORS[idx % INCOME_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => PESO(v)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5">
                            Expenditure composition
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={expenditureBreakdown} dataKey="value" nameKey="name" outerRadius={100} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {expenditureBreakdown.map((entry, idx) => (
                                        <Cell key={entry.name} fill={EXPENDITURE_COLORS[idx % EXPENDITURE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => PESO(v)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5 mb-8">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5">
                        Income vs. expenditure trend
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6F1FB" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => `₱${v}M`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v: number) => PESO(v)} />
                            <Legend />
                            <Bar dataKey="Income" fill="#185FA5" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expenditure" fill="#378ADD" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <ReferencesFooter
                    references={budgetReferences}
                    disclaimer="Figures are curated from BLGF's official per-LGU Statement of Receipts and Expenditures. FY2025 figures are preliminary and subject to revision by BLGF."
                />
            </Section>
        </main>
    );
}
```

- [ ] **Step 2: Write `page.tsx`**

```tsx
import { Metadata } from 'next';
import BudgetClient from './BudgetClient';

export const metadata: Metadata = {
    title: 'Budget & Finances',
    description: "See where Iligan City's revenue comes from and where it's spent, sourced from official BLGF fiscal reports.",
    openGraph: {
        title: 'Iligan City Budget & Finances',
        description: "See where Iligan City's revenue comes from and where it's spent.",
        url: 'https://betteriligancity.org/iligan/budget',
        type: 'website',
    },
};

export default function BudgetPage() {
    return <BudgetClient />;
}
```

- [ ] **Step 3: Verify locally**

Run: `npm run dev`
Visit `http://localhost:3000/iligan/budget` in a browser. Expected: hero renders, two donut charts render with 4 slices each and percentage labels, a grouped bar chart shows 2024 vs 2025 bars, sources footer shows the BLGF link. No console errors.

- [ ] **Step 4: Commit**

```bash
git add app/iligan/budget/
git commit -m "feat: add budget visualizer page with revenue/expenditure charts"
```

---

### Task 7: Add the API route

**Files:**
- Create: `app/api/v1/budget/route.ts`

- [ ] **Step 1: Write the route**, mirroring `app/api/v1/departments/route.ts` exactly:

```ts
import { NextResponse } from 'next/server';
import { BudgetSchema } from '@/validations/budgetSchema';
import rawBudgetData from '@/data/iligan/budget.json';

const budgetData = BudgetSchema.parse(rawBudgetData);

export async function GET() {
    return NextResponse.json({
        success: true,
        meta: {
            total: budgetData.years.length,
            lastUpdated: new Date().toISOString(),
            source: "BetterIliganCity Open Data API",
            description: "Iligan City annual revenue and expenditure breakdown, sourced from BLGF's Statement of Receipts and Expenditures."
        },
        data: budgetData
    }, {
        status: 200,
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, then in another terminal: `curl -s http://localhost:3000/api/v1/budget | head -c 300`
Expected: JSON starting with `{"success":true,"meta":{"total":2,...`

- [ ] **Step 3: Commit**

```bash
git add app/api/v1/budget/
git commit -m "feat: add /api/v1/budget open data endpoint"
```

---

### Task 8: Add navigation entry

**Files:**
- Modify: `data/navigation.json`

- [ ] **Step 1: Add the dropdown item**

In the `"Iligan City"` dropdown array, after the `"Electricity"` entry and before the closing `]`:

```json
            {
                "name": "Electricity",
                "description": "Information about power providers, services, and utilities in the city.",
                "href": "/iligan/electricity"
            },
            {
                "name": "Budget & Finances",
                "description": "See where the city's revenue comes from and where it's spent.",
                "href": "/iligan/budget"
            }
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open the site, click the "Iligan City" nav dropdown. Expected: "Budget & Finances" appears and links to `/iligan/budget`.

- [ ] **Step 3: Commit**

```bash
git add data/navigation.json
git commit -m "feat: add Budget & Finances to Iligan City nav dropdown"
```

---

### Task 9: Document the new endpoint on `/open-data`

**Files:**
- Modify: `app/open-data/page.tsx`

- [ ] **Step 1: Add a fourth endpoint block**

After the "National Agencies & GOCCs" block (the third `<div className="flex flex-col sm:flex-row ...">` in the "Available Endpoints" section), add:

```tsx
                            {/* 4. Budget & Finances */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-slate-900 rounded-xl p-4">
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-1">4. Budget & Finances</p>
                                    <p className="text-slate-400 text-xs">Returns Iligan City's annual revenue and expenditure breakdown.</p>
                                </div>
                                <code className="text-emerald-400 font-mono text-sm whitespace-nowrap bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                                    /api/v1/budget
                                </code>
                            </div>
```

Also update the intro sentence "We currently offer three separate REST endpoints..." to "four".

- [ ] **Step 2: Verify**

Run: `npm run dev`, visit `/open-data`. Expected: 4 endpoint blocks listed, intro text says "four".

- [ ] **Step 3: Commit**

```bash
git add app/open-data/page.tsx
git commit -m "docs: document /api/v1/budget on the open data page"
```

---

### Task 10: Final verification

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: succeeds with no type errors, no Zod parse failures, `/iligan/budget` and `/api/v1/budget` listed in the route output.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors introduced by the new files.

- [ ] **Step 3: Manual walkthrough**

With `npm run dev` running, check:
- `/` → nav dropdown → "Budget & Finances" → lands on `/iligan/budget`
- `/iligan/city-stats` → Economy tab → "Revenue (2024)" card is now clickable and links to `/iligan/budget`
- `/iligan/budget` → both donuts render with correct slice counts, bar chart shows 2 years, references footer shows BLGF source and the "preliminary" disclaimer
- `/api/v1/budget` → returns valid JSON
- `/open-data` → shows 4 endpoints

- [ ] **Step 4: Push branch**

```bash
git push -u origin feat/budget-visualizer
```

(Branch was already created during the design phase — see `docs/superpowers/specs/2026-07-02-budget-visualizer-design.md`.)

- [ ] **Step 5: Open the PR**

Title (per this repo's convention): `[feat: add budget visualizer page with revenue/expenditure charts]`
Body should reference the issue: `Closes #29`

Do NOT run this step without checking with the user first — opening a PR is a visible, shared-state action.
