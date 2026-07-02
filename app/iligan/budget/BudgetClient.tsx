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
            title: 'Bureau of Local Government Finance — Statement of Receipts and Expenditures by LGU (FY2024, FY2025 Preliminary)',
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
