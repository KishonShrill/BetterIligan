"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { BudgetData, BudgetYear } from "@/validations/budgetSchema";

const PESO = (millions: number) =>
  `₱${millions.toLocaleString("en-PH", { maximumFractionDigits: 0 })}M`;
const PERCENT = (n: number) => `${n.toFixed(1)}%`;
const yearLabel = (y: BudgetYear) =>
  y.status === "preliminary"
    ? `${y.fiscalYear} (Prelim.)`
    : String(y.fiscalYear);

const INCOME_COLORS = ["#047857", "#10b981", "#6ee7b7", "#a7f3d0"];
const EXPENDITURE_COLORS = ["#1e293b", "#475569", "#64748b", "#94a3b8"];

type MetricKey =
  | "localTax"
  | "localNonTax"
  | "nationalTaxAllotment"
  | "generalPublicServices"
  | "economicServices"
  | "socialServices"
  | "debtService"
  | "capitalOutlay"
  | "netOperatingSurplus";

const METRICS: Record<
  MetricKey,
  {
    label: string;
    percentOf: "income" | "expenditure";
    get: (y: BudgetYear) => number;
  }
> = {
  localTax: {
    label: "Local Tax Revenue",
    percentOf: "income",
    get: (y) => y.income.localTax,
  },
  localNonTax: {
    label: "Local Non-Tax Revenue",
    percentOf: "income",
    get: (y) => y.income.localNonTax,
  },
  nationalTaxAllotment: {
    label: "National Tax Allotment (IRA)",
    percentOf: "income",
    get: (y) => y.income.nationalTaxAllotment,
  },
  generalPublicServices: {
    label: "General Public Services",
    percentOf: "expenditure",
    get: (y) => y.expenditure.generalPublicServices,
  },
  economicServices: {
    label: "Economic Services",
    percentOf: "expenditure",
    get: (y) => y.expenditure.economicServices,
  },
  socialServices: {
    label: "Social Services",
    percentOf: "expenditure",
    get: (y) => y.expenditure.socialServices,
  },
  debtService: {
    label: "Debt Service",
    percentOf: "expenditure",
    get: (y) => y.expenditure.debtService,
  },
  capitalOutlay: {
    label: "Capital Outlay",
    percentOf: "income",
    get: (y) => y.capitalOutlay,
  },
  netOperatingSurplus: {
    label: "Net Operating Surplus",
    percentOf: "income",
    get: (y) => y.netOperatingSurplus,
  },
};

interface BudgetInteractiveProps {
  data: BudgetData;
}

export default function BudgetInteractive({ data }: BudgetInteractiveProps) {
  const latest = data.years[data.years.length - 1];

  const [selectedYear, setSelectedYear] = useState(latest.fiscalYear);
  const [selectedMetric, setSelectedMetric] = useState<"totals" | MetricKey>(
    "totals",
  );
  const [showPercent, setShowPercent] = useState(false);

  const shownYear =
    data.years.find((y) => y.fiscalYear === selectedYear) ?? latest;

  const incomeBreakdown = [
    {
      name: "National Tax Allotment (IRA)",
      value: shownYear.income.nationalTaxAllotment,
    },
    { name: "Local Tax Revenue", value: shownYear.income.localTax },
    { name: "Local Non-Tax Revenue", value: shownYear.income.localNonTax },
    { name: "Other External Sources", value: shownYear.income.otherExternal },
  ];

  const expenditureBreakdown = [
    {
      name: "General Public Services",
      value: shownYear.expenditure.generalPublicServices,
    },
    {
      name: "Economic Services",
      value: shownYear.expenditure.economicServices,
    },
    { name: "Social Services", value: shownYear.expenditure.socialServices },
    { name: "Debt Service", value: shownYear.expenditure.debtService },
  ];

  const totalsTrend = data.years.map((y) => ({
    year: yearLabel(y),
    Income: y.income.total,
    Expenditure: y.expenditure.total,
  }));

  const metricTrend = useMemo(() => {
    if (selectedMetric === "totals") return [];
    const metric = METRICS[selectedMetric];
    return data.years.map((y) => {
      const raw = metric.get(y);
      const denominator =
        metric.percentOf === "income" ? y.income.total : y.expenditure.total;
      return {
        year: yearLabel(y),
        Value: showPercent ? Math.round((raw / denominator) * 1000) / 10 : raw,
      };
    });
  }, [selectedMetric, showPercent, data.years]);

  return (
    <>
      {/* Ledger strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          At a glance · FY{latest.fiscalYear}
        </h2>
        <div className="flex items-baseline gap-3 py-2.5">
          <span className="text-sm whitespace-nowrap text-slate-500">
            Net Operating Surplus
          </span>
          <span className="flex-1 translate-y-[-4px] border-b border-dotted border-slate-300" />
          <span className="font-mono text-xl font-extrabold text-emerald-700 tabular-nums">
            {PESO(latest.netOperatingSurplus)}
          </span>
        </div>
        <div className="flex items-baseline gap-3 border-t border-slate-100 py-2.5">
          <span className="text-sm whitespace-nowrap text-slate-500">
            Capital Outlay
          </span>
          <span className="flex-1 translate-y-[-4px] border-b border-dotted border-slate-300" />
          <span className="font-mono text-xl font-extrabold text-slate-900 tabular-nums">
            {PESO(latest.capitalOutlay)}
          </span>
        </div>
        <div className="flex items-baseline gap-3 border-t border-slate-100 py-2.5">
          <span className="text-sm whitespace-nowrap text-slate-500">
            Total Income
          </span>
          <span className="flex-1 translate-y-[-4px] border-b border-dotted border-slate-300" />
          <span className="font-mono text-sm text-slate-600 tabular-nums">
            {PESO(latest.income.total)}
          </span>
        </div>
        <div className="flex items-baseline gap-3 border-t border-slate-100 py-2.5">
          <span className="text-sm whitespace-nowrap text-slate-500">
            Total Expenditure
          </span>
          <span className="flex-1 translate-y-[-4px] border-b border-dotted border-slate-300" />
          <span className="font-mono text-sm text-slate-600 tabular-nums">
            {PESO(latest.expenditure.total)}
          </span>
        </div>
      </div>

      {/* Composition */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Revenue & spending breakdown
          </h2>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            {data.years.map((y) => (
              <button
                key={y.fiscalYear}
                onClick={() => setSelectedYear(y.fiscalYear)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${y.fiscalYear === selectedYear ? "bg-emerald-700 text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {yearLabel(y)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <h3 className="mb-1 text-base font-bold text-slate-900">
              Where the money comes from
            </h3>
            <p className="mb-3 text-sm text-slate-500">
              Revenue sources, FY{shownYear.fiscalYear}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  label={({ percent }) =>
                    `${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {incomeBreakdown.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={INCOME_COLORS[idx % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => PESO(v)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#0f172a" }}
                  itemStyle={{ color: "#0f172a" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: 11,
                    lineHeight: "20px",
                    color: "#334155",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <h3 className="mb-1 text-base font-bold text-slate-900">
              Where the money goes
            </h3>
            <p className="mb-3 text-sm text-slate-500">
              Expenditure by sector, FY{shownYear.fiscalYear}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenditureBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  label={({ percent }) =>
                    `${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {expenditureBreakdown.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={EXPENDITURE_COLORS[idx % EXPENDITURE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => PESO(v)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#0f172a" }}
                  itemStyle={{ color: "#0f172a" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: 11,
                    lineHeight: "20px",
                    color: "#334155",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Trend over time</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedMetric}
                onChange={(e) =>
                  setSelectedMetric(e.target.value as "totals" | MetricKey)
                }
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pr-8 pl-3 text-xs font-bold text-slate-700 [color-scheme:light] hover:border-slate-300"
              >
                <option value="totals">Total Income & Expenditure</option>
                {(Object.keys(METRICS) as MetricKey[]).map((key) => (
                  <option key={key} value={key}>
                    {METRICS[key].label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
            <button
              onClick={() => setShowPercent((v) => !v)}
              disabled={selectedMetric === "totals"}
              title={
                selectedMetric === "totals"
                  ? "Pick a specific category to view it as a percentage"
                  : undefined
              }
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === "totals"
                  ? "cursor-not-allowed border-slate-100 text-slate-300"
                  : showPercent
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              % of{" "}
              {selectedMetric !== "totals" &&
              METRICS[selectedMetric].percentOf === "income"
                ? "income"
                : "spending"}
            </button>
          </div>
        </div>
        <p className="mb-3 text-sm text-slate-500">
          {selectedMetric === "totals"
            ? "Is the city collecting more than it spends?"
            : showPercent
              ? `${METRICS[selectedMetric].label} as a share of total ${METRICS[selectedMetric].percentOf === "income" ? "income" : "expenditure"} each year.`
              : `${METRICS[selectedMetric].label} in raw pesos each year.`}
        </p>

        {selectedMetric === "totals" ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={totalsTrend}
              margin={{ top: 24, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                tickFormatter={(v) => `₱${v}M`}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(v: number) => PESO(v)}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#0f172a" }}
                itemStyle={{ color: "#0f172a" }}
              />
              <Legend wrapperStyle={{ color: "#334155" }} />
              <Bar dataKey="Income" fill="#047857" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="Income"
                  position="top"
                  formatter={(v: number) => PESO(v)}
                  fontSize={11}
                  fill="#047857"
                />
              </Bar>
              <Bar dataKey="Expenditure" fill="#475569" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="Expenditure"
                  position="top"
                  formatter={(v: number) => PESO(v)}
                  fontSize={11}
                  fill="#475569"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={metricTrend}
              margin={{ top: 24, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                tickFormatter={(v) => (showPercent ? `${v}%` : `₱${v}M`)}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(v: number) => (showPercent ? PERCENT(v) : PESO(v))}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#0f172a" }}
                itemStyle={{ color: "#0f172a" }}
              />
              <Bar
                dataKey="Value"
                name={METRICS[selectedMetric].label}
                fill="#047857"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="Value"
                  position="top"
                  formatter={(v: number) =>
                    showPercent ? PERCENT(v) : PESO(v)
                  }
                  fontSize={11}
                  fill="#047857"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
