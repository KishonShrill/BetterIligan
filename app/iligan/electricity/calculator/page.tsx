"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Zap,
  Calendar,
  CalendarDays,
  CalendarCheck,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import SubpageHero from "@/components/ui/SubpageHero";

// --- CONFIGURATION ---
// Change these values whenever you update the rates!
const ILPI_DATA = {
  rate: 15.1326,
  lastUpdated: "2026-08-20", // Use YYYY-MM-DD format
};

// Quick preset appliances for user convenience
const APPLIANCE_PRESETS = [
  { name: "Custom", watts: "" },
  { name: "Window AC (1 HP)", watts: 1000 },
  { name: "Split AC (1.5 HP)", watts: 1500 },
  { name: "Refrigerator", watts: 150 },
  { name: "Electric Fan", watts: 65 },
  { name: "Desktop Computer", watts: 250 },
  { name: 'LED TV (40")', watts: 40 },
  { name: "Rice Cooker", watts: 700 },
];

export default function ElectricityCalculatorPage() {
  // --- STATE ---
  const [ratePerKWh, setRatePerKWh] = useState<number | string>(ILPI_DATA.rate);
  const [wattage, setWattage] = useState<number | string>("");
  const [hoursPerDay, setHoursPerDay] = useState<number | string>(8);

  // --- DATE LOGIC ---
  const updatedDate = new Date(ILPI_DATA.lastUpdated);
  const currentDate = new Date();

  // Calculate if it has been more than 30 days
  const timeDifference = currentDate.getTime() - updatedDate.getTime();
  const daysSinceUpdate = timeDifference / (1000 * 3600 * 24);
  const isStale = daysSinceUpdate > 30;

  // Formatting for the UI
  const formattedFullDate = updatedDate.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedBillingMonth = updatedDate.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  // --- CALCULATIONS ---
  const watts = Number(wattage) || 0;
  const hours = Number(hoursPerDay) || 0;
  const rate = Number(ratePerKWh) || 0;

  // Formula: (Watts * Hours / 1000) * Rate
  const kwhPerDay = (watts * hours) / 1000;
  const costPerDay = kwhPerDay * rate;
  const costPerMonth = costPerDay * 30; // Assuming 30 days
  const costPerYear = costPerDay * 365;

  // Format currency helper
  const formatPesos = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageHero>
        <SubpageHero.Badges>
          <Link
            href="/iligan/electricity"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Electricity
          </Link>

          {/* Dynamic Staleness Badge */}
          <span
            suppressHydrationWarning
            className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sm ${
              isStale
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {isStale ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <CalendarCheck className="h-3.5 w-3.5" />
            )}
            {isStale ? "Stale Information:" : "Recently Updated:"}{" "}
            {formattedFullDate}
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Appliance Cost Calculator</SubpageHero.Title>
        <SubpageHero.Description>
          Estimate how much an appliance adds to your monthly ILPI bill based on
          its power consumption and your usage habits.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[1000px] px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* --- LEFT SIDE: THE INPUTS (7 Columns) --- */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-7">
            <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
                <Calculator className="h-6 w-6" />
              </div>
              <h2 className="text-xl leading-tight font-bold text-slate-900">
                Calculator Inputs
              </h2>
            </div>

            <div className="space-y-6">
              {/* Current ILPI Rate */}
              <div>
                <label className="mb-1.5 block flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>ILPI Rate per kWh (₱)</span>
                  <Link
                    href="/iligan/electricity#ilpi"
                    className="flex cursor-help cursor-pointer items-center gap-1 text-xs font-normal text-slate-400 hover:underline"
                    title="Check your latest ILPI bill for the exact blended rate"
                  >
                    <HelpCircle className="h-3.5 w-3.5" /> Where to find this?
                  </Link>
                </label>
                <input
                  type="number"
                  value={ratePerKWh}
                  onChange={(e) => setRatePerKWh(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 11.50"
                />
                <p
                  suppressHydrationWarning
                  className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isStale ? "bg-amber-500" : "bg-emerald-500"}`}
                  ></span>
                  Default rate based on ILPI billing for{" "}
                  <strong className="text-slate-700">
                    {formattedBillingMonth}
                  </strong>
                </p>
              </div>

              {/* Appliance Presets */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {APPLIANCE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setWattage(preset.watts)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                        wattage === preset.watts && preset.watts !== ""
                          ? "border-amber-200 bg-amber-100 text-amber-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Appliance Wattage */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Appliance Power (Watts)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={wattage}
                      onChange={(e) => setWattage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-4 font-medium text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 1500"
                    />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-slate-400">
                      W
                    </div>
                  </div>
                </div>

                {/* Usage Hours */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Usage per day (Hours)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                      max="24"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-16 pl-4 font-medium text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 8"
                    />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-slate-400">
                      hrs/day
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE RESULTS (5 Columns) --- */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
            {/* Daily Cost Card */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              {/* Decorative background element */}
              <Zap className="absolute -right-4 -bottom-4 h-32 w-32 text-white opacity-5" />

              <h3 className="mb-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
                Estimated Daily Cost
              </h3>
              <div className="text-4xl font-extrabold tracking-tight">
                {formatPesos(costPerDay)}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Uses {kwhPerDay.toFixed(2)} kWh per day
              </div>
            </div>

            {/* Monthly & Yearly Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <Calendar className="mb-2 h-5 w-5 text-amber-500" />
                <h4 className="mb-1 text-xs font-bold text-slate-500 uppercase">
                  Per Month
                </h4>
                <div className="text-xl font-extrabold text-slate-900">
                  {formatPesos(costPerMonth)}
                </div>
                <span className="mt-1 text-[10px] text-slate-400">
                  Based on 30 days
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <CalendarDays className="mb-2 h-5 w-5 text-blue-500" />
                <h4 className="mb-1 text-xs font-bold text-slate-500 uppercase">
                  Per Year
                </h4>
                <div className="text-xl font-extrabold text-slate-900">
                  {formatPesos(costPerYear)}
                </div>
                <span className="mt-1 text-[10px] text-slate-400">
                  Based on 365 days
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs leading-relaxed text-amber-700">
                <strong>Disclaimer:</strong> This calculator provides rough
                estimates. Actual ILPI bills include tiered generation charges,
                distribution fees, systems loss charges, and lifeline subsidies
                which may alter the final amount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
