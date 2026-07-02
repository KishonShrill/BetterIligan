'use client'

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList,
} from 'recharts';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

import { BudgetSchema, BudgetData } from '@/validations/budgetSchema';
import rawBudgetData from '@/data/iligan/budget.json';

const budgetData: BudgetData = BudgetSchema.parse(rawBudgetData);

const PESO = (millions: number) => `₱${millions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}M`;

const INCOME_COLORS = ['#047857', '#10b981', '#6ee7b7', '#a7f3d0'];
const EXPENDITURE_COLORS = ['#1e293b', '#475569', '#64748b', '#94a3b8'];

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
                    <h2 className="text-lg font-bold text-slate-900 mb-4">At a glance</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Where the money comes from</h2>
                        <p className="text-sm text-slate-500 mb-3">Revenue sources, FY{latest.fiscalYear}</p>
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
                                <Tooltip formatter={(v: number) => PESO(v)} />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 11, lineHeight: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Where the money goes</h2>
                        <p className="text-sm text-slate-500 mb-3">Expenditure by sector, FY{latest.fiscalYear}</p>
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
                                <Tooltip formatter={(v: number) => PESO(v)} />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 11, lineHeight: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Trend — the one thing a snapshot can't show: is it growing */}
                <div className="bg-white border border-slate-200 rounded-2xl md:p-8 p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Income vs. expenditure, year over year</h2>
                    <p className="text-sm text-slate-500 mb-3">Is the city collecting more than it spends?</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={trend} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => `₱${v}M`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v: number) => PESO(v)} />
                            <Legend />
                            <Bar dataKey="Income" fill="#047857" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Income" position="top" formatter={(v: number) => PESO(v)} fontSize={11} fill="#047857" />
                            </Bar>
                            <Bar dataKey="Expenditure" fill="#475569" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Expenditure" position="top" formatter={(v: number) => PESO(v)} fontSize={11} fill="#475569" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <ReferencesFooter
                    references={budgetReferences}
                    disclaimer="Figures are curated from BLGF's official per-LGU Statement of Receipts and Expenditures. FY2025 figures are preliminary and subject to revision by BLGF."
                />
            </div>
        </main>
    );
}
