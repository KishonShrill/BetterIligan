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

const ILIGAN_ROW = 215; // Confirmed for FY2024/FY2025 files; verify column D ("LGU NAME") still reads "Iligan City" for new years.

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

    const row = sheet.getRow(ILIGAN_ROW);
    const lguName = row.getCell(4).value;
    if (String(lguName).trim() !== 'Iligan City') {
        throw new Error(`Row ${ILIGAN_ROW} is "${lguName}", not "Iligan City" — BLGF likely re-sorted the sheet. Find the correct row manually.`);
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
