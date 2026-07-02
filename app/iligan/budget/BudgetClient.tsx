'use client'

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList,
} from 'recharts';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

import { BudgetSchema, BudgetData, BudgetYear } from '@/validations/budgetSchema';
import rawBudgetData from '@/data/iligan/budget.json';

const budgetData: BudgetData = BudgetSchema.parse(rawBudgetData);

const PESO = (millions: number) => `₱${millions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}M`;
const PERCENT = (n: number) => `${n.toFixed(1)}%`;
const yearLabel = (y: BudgetYear) => (y.status === 'preliminary' ? `${y.fiscalYear} (Prelim.)` : String(y.fiscalYear));

const INCOME_COLORS = ['#047857', '#10b981', '#6ee7b7', '#a7f3d0'];
const EXPENDITURE_COLORS = ['#1e293b', '#475569', '#64748b', '#94a3b8'];

type MetricKey =
    | 'localTax' | 'localNonTax' | 'nationalTaxAllotment'
    | 'generalPublicServices' | 'economicServices' | 'socialServices' | 'debtService'
    | 'capitalOutlay' | 'netOperatingSurplus';

// "percentOf" is the denominator each metric is measured against when the trend
// is viewed as a share rather than a raw amount — expenditure categories are a
// share of total spending; everything else (revenue, capital outlay, surplus) is
// a share of total income, since those aren't part of the operating-expenditure bucket.
const METRICS: Record<MetricKey, { label: string; percentOf: 'income' | 'expenditure'; get: (y: BudgetYear) => number }> = {
    localTax: { label: 'Local Tax Revenue', percentOf: 'income', get: (y) => y.income.localTax },
    localNonTax: { label: 'Local Non-Tax Revenue', percentOf: 'income', get: (y) => y.income.localNonTax },
    nationalTaxAllotment: { label: 'National Tax Allotment (IRA)', percentOf: 'income', get: (y) => y.income.nationalTaxAllotment },
    generalPublicServices: { label: 'General Public Services', percentOf: 'expenditure', get: (y) => y.expenditure.generalPublicServices },
    economicServices: { label: 'Economic Services', percentOf: 'expenditure', get: (y) => y.expenditure.economicServices },
    socialServices: { label: 'Social Services', percentOf: 'expenditure', get: (y) => y.expenditure.socialServices },
    debtService: { label: 'Debt Service', percentOf: 'expenditure', get: (y) => y.expenditure.debtService },
    capitalOutlay: { label: 'Capital Outlay', percentOf: 'income', get: (y) => y.capitalOutlay },
    netOperatingSurplus: { label: 'Net Operating Surplus', percentOf: 'income', get: (y) => y.netOperatingSurplus },
};

export default function BudgetClient() {
    const latest = budgetData.years[budgetData.years.length - 1];

    const [selectedYear, setSelectedYear] = useState(latest.fiscalYear);
    const [selectedMetric, setSelectedMetric] = useState<'totals' | MetricKey>('totals');
    const [showPercent, setShowPercent] = useState(false);

    const shownYear = budgetData.years.find((y) => y.fiscalYear === selectedYear) ?? latest;

    const incomeBreakdown = [
        { name: 'National Tax Allotment (IRA)', value: shownYear.income.nationalTaxAllotment },
        { name: 'Local Tax Revenue', value: shownYear.income.localTax },
        { name: 'Local Non-Tax Revenue', value: shownYear.income.localNonTax },
        { name: 'Other External Sources', value: shownYear.income.otherExternal },
    ];

    const expenditureBreakdown = [
        { name: 'General Public Services', value: shownYear.expenditure.generalPublicServices },
        { name: 'Economic Services', value: shownYear.expenditure.economicServices },
        { name: 'Social Services', value: shownYear.expenditure.socialServices },
        { name: 'Debt Service', value: shownYear.expenditure.debtService },
    ];

    const totalsTrend = budgetData.years.map((y) => ({
        year: yearLabel(y),
        Income: y.income.total,
        Expenditure: y.expenditure.total,
    }));

    const metricTrend = useMemo(() => {
        if (selectedMetric === 'totals') return [];
        const metric = METRICS[selectedMetric];
        return budgetData.years.map((y) => {
            const raw = metric.get(y);
            const denominator = metric.percentOf === 'income' ? y.income.total : y.expenditure.total;
            return {
                year: yearLabel(y),
                Value: showPercent ? Math.round((raw / denominator) * 1000) / 10 : raw,
            };
        });
    }, [selectedMetric, showPercent]);

    const budgetReferences = [
        {
            title: 'Bureau of Local Government Finance — Statement of Receipts and Expenditures by LGU (FY2024, FY2025 Preliminary)',
            url: 'https://blgf.gov.ph/lgu-fiscal-data/',
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/' text='Go Home' />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                        Public Finance · FY{latest.fiscalYear} {latest.status === 'preliminary' && '(Preliminary)'}
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Budget & Finances</SubpageHero.Title>
                <SubpageHero.Description>
                    Every peso Iligan City collects, and every peso it spends — filed by the City Treasurer
                    with the Bureau of Local Government Finance.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-404 mx-auto px-4 md:px-6 py-6 md:py-12 space-y-8">

                {/* Ledger strip — receipt-style line items, tabular figures for easy scanning */}
                <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">At a glance · FY{latest.fiscalYear}</h2>
                    <div className="flex items-baseline gap-3 py-2.5">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Net Operating Surplus</span>
                        <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-4px]" />
                        <span className="text-xl font-mono tabular-nums font-extrabold text-emerald-700">{PESO(latest.netOperatingSurplus)}</span>
                    </div>
                    <div className="flex items-baseline gap-3 py-2.5 border-t border-slate-100">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Capital Outlay</span>
                        <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-4px]" />
                        <span className="text-xl font-mono tabular-nums font-extrabold text-slate-900">{PESO(latest.capitalOutlay)}</span>
                    </div>
                    <div className="flex items-baseline gap-3 py-2.5 border-t border-slate-100">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Total Income</span>
                        <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-4px]" />
                        <span className="text-sm font-mono tabular-nums text-slate-600">{PESO(latest.income.total)}</span>
                    </div>
                    <div className="flex items-baseline gap-3 py-2.5 border-t border-slate-100">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Total Expenditure</span>
                        <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-4px]" />
                        <span className="text-sm font-mono tabular-nums text-slate-600">{PESO(latest.expenditure.total)}</span>
                    </div>
                </div>

                {/* Composition — the two questions everyone actually asks: where's it from, where's it going */}
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Revenue & spending breakdown</h2>
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                            {budgetData.years.map((y) => (
                                <button
                                    key={y.fiscalYear}
                                    onClick={() => setSelectedYear(y.fiscalYear)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${y.fiscalYear === selectedYear ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    {yearLabel(y)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-1">Where the money comes from</h3>
                            <p className="text-sm text-slate-500 mb-3">Revenue sources, FY{shownYear.fiscalYear}</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={incomeBreakdown}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={2}
                                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {incomeBreakdown.map((entry, idx) => (
                                            <Cell key={entry.name} fill={INCOME_COLORS[idx % INCOME_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v: number) => PESO(v)}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                                        labelStyle={{ color: '#0f172a' }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: 11, lineHeight: '20px', color: '#334155' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-1">Where the money goes</h3>
                            <p className="text-sm text-slate-500 mb-3">Expenditure by sector, FY{shownYear.fiscalYear}</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={expenditureBreakdown}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={2}
                                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {expenditureBreakdown.map((entry, idx) => (
                                            <Cell key={entry.name} fill={EXPENDITURE_COLORS[idx % EXPENDITURE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v: number) => PESO(v)}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                                        labelStyle={{ color: '#0f172a' }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: 11, lineHeight: '20px', color: '#334155' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Trend — pick any line item and watch it move across years */}
                <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                        <h2 className="text-lg font-bold text-slate-900">Trend over time</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    value={selectedMetric}
                                    onChange={(e) => setSelectedMetric(e.target.value as 'totals' | MetricKey)}
                                    className="appearance-none text-xs font-bold border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 bg-white text-slate-700 [color-scheme:light] hover:border-slate-300 cursor-pointer"
                                >
                                    <option value="totals">Total Income & Expenditure</option>
                                    {(Object.keys(METRICS) as MetricKey[]).map((key) => (
                                        <option key={key} value={key}>{METRICS[key].label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <button
                                onClick={() => setShowPercent((v) => !v)}
                                disabled={selectedMetric === 'totals'}
                                title={selectedMetric === 'totals' ? 'Pick a specific category to view it as a percentage' : undefined}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedMetric === 'totals'
                                    ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                    : showPercent
                                        ? 'bg-emerald-700 text-white border-emerald-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                % of {selectedMetric !== 'totals' && METRICS[selectedMetric].percentOf === 'income' ? 'income' : 'spending'}
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">
                        {selectedMetric === 'totals'
                            ? 'Is the city collecting more than it spends?'
                            : showPercent
                                ? `${METRICS[selectedMetric].label} as a share of total ${METRICS[selectedMetric].percentOf === 'income' ? 'income' : 'expenditure'} each year.`
                                : `${METRICS[selectedMetric].label} in raw pesos each year.`}
                    </p>

                    {selectedMetric === 'totals' ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={totalsTrend} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tickFormatter={(v) => `₱${v}M`} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    formatter={(v: number) => PESO(v)}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                                    labelStyle={{ color: '#0f172a' }}
                                    itemStyle={{ color: '#0f172a' }}
                                />
                                <Legend wrapperStyle={{ color: '#334155' }} />
                                <Bar dataKey="Income" fill="#047857" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Income" position="top" formatter={(v: number) => PESO(v)} fontSize={11} fill="#047857" />
                                </Bar>
                                <Bar dataKey="Expenditure" fill="#475569" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Expenditure" position="top" formatter={(v: number) => PESO(v)} fontSize={11} fill="#475569" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={metricTrend} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tickFormatter={(v) => (showPercent ? `${v}%` : `₱${v}M`)} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    formatter={(v: number) => (showPercent ? PERCENT(v) : PESO(v))}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                                    labelStyle={{ color: '#0f172a' }}
                                    itemStyle={{ color: '#0f172a' }}
                                />
                                <Bar dataKey="Value" name={METRICS[selectedMetric].label} fill="#047857" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Value" position="top" formatter={(v: number) => (showPercent ? PERCENT(v) : PESO(v))} fontSize={11} fill="#047857" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <ReferencesFooter
                    references={budgetReferences}
                    disclaimer="Figures are curated from BLGF's official per-LGU Statement of Receipts and Expenditures. FY2025 figures are preliminary and subject to revision by BLGF."
                />
            </div>
        </main>
    );
}
