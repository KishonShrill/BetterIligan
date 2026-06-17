'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Zap, Calendar, CalendarDays, HelpCircle } from 'lucide-react';
import SubpageHero from '@/components/ui/SubpageHero';

// Quick preset appliances for user convenience
const APPLIANCE_PRESETS = [
    { name: 'Custom', watts: '' },
    { name: 'Window AC (1 HP)', watts: 1000 },
    { name: 'Split AC (1.5 HP)', watts: 1500 },
    { name: 'Refrigerator', watts: 150 },
    { name: 'Electric Fan', watts: 65 },
    { name: 'Desktop Computer', watts: 250 },
    { name: 'LED TV (40")', watts: 40 },
    { name: 'Rice Cooker', watts: 700 },
];

export default function ElectricityCalculatorPage() {
    // --- STATE ---
    // Update the default rate here based on the exact Residential rate from your ILPI images
    const [ratePerKWh, setRatePerKWh] = useState<number | string>(13.3948);
    const [wattage, setWattage] = useState<number | string>('');
    const [hoursPerDay, setHoursPerDay] = useState<number | string>(8);

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
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageHero>
                <div className="mb-4">
                    <Link
                        href="/iligan/electricity"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Electricity
                    </Link>
                </div>
                <SubpageHero.Title>Appliance Cost Calculator</SubpageHero.Title>
                <SubpageHero.Description>
                    Estimate how much an appliance adds to your monthly ILPI bill based on its power consumption and your usage habits.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- LEFT SIDE: THE INPUTS (7 Columns) --- */}
                    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                Calculator Inputs
                            </h2>
                        </div>

                        <div className="space-y-6">

                            {/* Current ILPI Rate */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>ILPI Rate per kWh (₱)</span>
                                    <span className="text-xs font-normal text-slate-400 flex items-center gap-1 cursor-help" title="Check your latest ILPI bill for the exact blended rate">
                                        <HelpCircle className="w-3.5 h-3.5" /> Where to find this?
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={ratePerKWh}
                                    onChange={(e) => setRatePerKWh(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                    placeholder="e.g. 11.50"
                                />
                            </div>

                            {/* Appliance Presets */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Quick Presets</label>
                                <div className="flex flex-wrap gap-2">
                                    {APPLIANCE_PRESETS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setWattage(preset.watts)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${wattage === preset.watts && preset.watts !== ''
                                                ? 'bg-amber-100 border-amber-200 text-amber-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Appliance Wattage */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Appliance Power (Watts)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={wattage}
                                            onChange={(e) => setWattage(e.target.value)}
                                            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                            placeholder="e.g. 1500"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                                            W
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Hours */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Usage per day (Hours)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={hoursPerDay}
                                            onChange={(e) => setHoursPerDay(e.target.value)}
                                            max="24"
                                            className="w-full pl-4 pr-16 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                            placeholder="e.g. 8"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                                            hrs/day
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: THE RESULTS (5 Columns) --- */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

                        {/* Daily Cost Card */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            {/* Decorative background element */}
                            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5" />

                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Estimated Daily Cost</h3>
                            <div className="text-4xl font-extrabold tracking-tight">
                                {formatPesos(costPerDay)}
                            </div>
                            <div className="text-sm text-slate-400 mt-2">
                                Uses {kwhPerDay.toFixed(2)} kWh per day
                            </div>
                        </div>

                        {/* Monthly & Yearly Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
                                <Calendar className="w-5 h-5 text-amber-500 mb-2" />
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Per Month</h4>
                                <div className="text-xl font-extrabold text-slate-900">
                                    {formatPesos(costPerMonth)}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1">Based on 30 days</span>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
                                <CalendarDays className="w-5 h-5 text-blue-500 mb-2" />
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Per Year</h4>
                                <div className="text-xl font-extrabold text-slate-900">
                                    {formatPesos(costPerYear)}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1">Based on 365 days</span>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <p className="text-xs text-amber-700 leading-relaxed">
                                <strong>Disclaimer:</strong> This calculator provides rough estimates. Actual ILPI bills include tiered generation charges, distribution fees, systems loss charges, and lifeline subsidies which may alter the final amount.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
