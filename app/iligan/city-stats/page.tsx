'use client'

import { useState } from 'react';
import {
    Shield, Users, Map, Droplets, Landmark, Zap,
    Anchor, Phone, GraduationCap, Stethoscope, CloudSun
} from 'lucide-react';
import Section from '@/components/ui/Section';

export default function CityStatsFullPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'demographics' | 'environment' | 'infrastructure'>('all');

    return (
        <Section className="bg-[#F8FAFC] text-slate-900 min-h-screen py-12 selection:bg-blue-100 selection:text-blue-900">

            {/* --- CITY PROFILE HEADER BLOCK --- */}
            <div className="relative bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 border border-blue-500/30 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden shadow-lg shadow-blue-900/10 text-white">
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    {/* Official Seal / Icon Placeholder */}
                    <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0">
                        <Shield className="w-12 h-12 text-blue-600" />
                    </div>

                    {/* Title and Fast Metadata */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
                            <span className="bg-white/20 text-blue-50 text-xs border border-white/30 font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                                Classification: Highly Urbanized City
                            </span>
                            <span className="bg-amber-400/20 text-amber-200 text-xs border border-amber-400/30 font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                                Founded: 1950
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm">
                            ILIGAN CITY
                        </h1>
                        <p className="text-blue-100 font-medium text-sm md:text-base mt-1 max-w-2xl">
                            Official City Profile. Known for its rich industrial heritage and globally renowned as the <span className="text-cyan-300 font-bold">"City of Majestic Waterfalls"</span>.
                        </p>
                    </div>
                </div>

                {/* Quick Core Demographics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20 text-center md:text-left relative z-10">
                    <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Charter Date</p>
                        <p className="text-sm font-black text-white mt-0.5">June 16, 1950</p>
                        <p className="text-[10px] text-blue-300">Republic Act No. 525</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Literacy Rate</p>
                        <p className="text-sm font-black text-emerald-300 mt-0.5">94.71%</p>
                        <p className="text-[10px] text-blue-300">Educational Baseline</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Growth Rate</p>
                        <p className="text-sm font-black text-white mt-0.5">+1.18%</p>
                        <p className="text-[10px] text-blue-300">Annual Population Trend</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Primary Dialect</p>
                        <p className="text-sm font-black text-purple-200 mt-0.5">Cebuano</p>
                        <p className="text-[10px] text-blue-300">Widely spoken in the region</p>
                    </div>
                </div>
            </div>

            {/* --- CONTROLS / TABS (FIXED FOR MOBILE TOUCH INTERACTION) --- */}
            <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-xl mb-8 overflow-x-auto scrollbar-none shadow-sm touch-pan-x px-3">
                {(['all', 'demographics', 'environment', 'infrastructure'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        // Added 'touch-none pointer-events-auto' variant logic to enforce instant clicks without triggering parent scrolling misinterpretations
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all select-none pointer-events-auto ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        {tab === 'all' && '🎛️ City Overview'}
                        {tab === 'demographics' && '📊 Demographics'}
                        {tab === 'environment' && '🍃 Environment & Tourism'}
                        {tab === 'infrastructure' && '🏢 City Infrastructure'}
                    </button>
                ))}
            </div>

            {/* --- DATA PANELS GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT / MAIN COLUMN: PANELS */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* CATEGORY 1: DEMOGRAPHICS */}
                    {(activeTab === 'all' || activeTab === 'demographics') && (
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                                <Users className="w-5 h-5 text-blue-600" />
                                <h2 className="font-black text-md text-slate-800 uppercase tracking-wider">Population & Demographics</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Total Population</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">363,115</p>
                                    <p className="text-xs text-slate-500 mt-1">Sourced from the latest 2020 Census records.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Population Density</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">421 / km²</p>
                                    <p className="text-xs text-slate-500 mt-1">Inhabitants per square kilometer of city territory.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Total Households</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">87,239</p>
                                    <p className="text-xs text-slate-500 mt-1">Averaging <span className="text-blue-600 font-bold">4.2</span> members per household.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Political Subdivisions</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">44 Barangays</p>
                                    <p className="text-xs text-slate-500 mt-1">Local administrative units serving the city's districts.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CATEGORY 2: ENVIRONMENT & TOURISM */}
                    {(activeTab === 'all' || activeTab === 'environment') && (
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                                <Droplets className="w-5 h-5 text-cyan-500" />
                                <h2 className="font-black text-md text-slate-800 uppercase tracking-wider">Natural Wonders & Tourism</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-center">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mx-auto text-cyan-600 font-bold mb-2 shadow-sm">23</div>
                                    <p className="text-[11px] font-bold uppercase text-cyan-700 tracking-wider">Waterfalls</p>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 text-center">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mx-auto text-teal-600 font-bold mb-2 shadow-sm">8</div>
                                    <p className="text-[11px] font-bold uppercase text-teal-700 tracking-wider">Natural Springs</p>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mx-auto text-indigo-600 font-bold mb-2 shadow-sm">15</div>
                                    <p className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider">Tourist Caves</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CloudSun className="w-4 h-4 text-orange-500" />
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Climate Profile</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">Short Dry Season</p>
                                    <p className="text-xs text-slate-500 mt-1">1 to 3 months of dry spells, with rainfall evenly distributed throughout the year.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Map className="w-4 h-4 text-emerald-500" />
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Soil Type</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">Cool Highland Mountain Soil</p>
                                    <p className="text-xs text-slate-500 mt-1">Geological foundation suitable for diverse agricultural and environmental growth.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CATEGORY 3: INFRASTRUCTURE */}
                    {(activeTab === 'all' || activeTab === 'infrastructure') && (
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                                <h2 className="font-black text-md text-slate-800 uppercase tracking-wider">Facilities & Infrastructure</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Education */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="p-2 bg-white shadow-sm text-purple-600 rounded-lg shrink-0">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Educational Institutions</p>
                                        <p className="text-xl font-black text-slate-900 mt-0.5">181 Schools</p>
                                        <p className="text-xs text-slate-500 mt-1">106 Public • 75 Private • 17 Madrasah facilities available.</p>
                                    </div>
                                </div>

                                {/* Health */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="p-2 bg-white shadow-sm text-rose-500 rounded-lg shrink-0">
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Healthcare Facilities</p>
                                        <p className="text-xl font-black text-slate-900 mt-0.5">54 Facilities</p>
                                        <p className="text-xs text-slate-500 mt-1">5 Core Hospitals • 49 Barangay Health centers active.</p>
                                    </div>
                                </div>

                                {/* Power */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="p-2 bg-white shadow-sm text-amber-500 rounded-lg shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Power Generation</p>
                                        <p className="text-xl font-black text-slate-900 mt-0.5">3 Hydro Plants</p>
                                        <p className="text-xs text-slate-500 mt-1">Renewable hydro-electric power systems supplying the city.</p>
                                    </div>
                                </div>

                                {/* Seaports */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="p-2 bg-white shadow-sm text-blue-500 rounded-lg shrink-0">
                                        <Anchor className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-wider">Seaports & Maritime</p>
                                        <p className="text-xl font-black text-slate-900 mt-0.5">12 Seaports</p>
                                        <p className="text-xs text-slate-500 mt-1">1 Public Port • 9 Private Ports • 2 Fishing anchor docks.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR: COMMERCE & COMMUNICATIONS */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* LAND AREA */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Map className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Land Classification</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Land Area</span>
                                <span className="text-xl font-black text-slate-900">81,337 ha</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <span className="text-[10px] uppercase text-slate-400 font-bold block">Metric Equivalent</span>
                                <span className="text-sm font-bold text-emerald-600">813.37 Square Kilometers</span>
                            </div>
                        </div>
                    </div>

                    {/* INDUSTRY & BANKING */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Landmark className="w-4 h-4 text-indigo-600" />
                            <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Economy & Commerce</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-600">Industrial Sector</span>
                                <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200">11 Major Industries</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-600">Banking & Finance</span>
                                <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">24 Banks Total</span>
                            </div>
                            <p className="text-[10px] text-slate-500 text-center italic">Distribution: 4 Private Banks • 20 Public Branches</p>
                        </div>
                    </div>

                    {/* COMMUNICATIONS */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Phone className="w-4 h-4 text-amber-500" />
                            <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Communications Network</h3>
                        </div>
                        <ul className="text-xs space-y-2.5 text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span><strong>4 Digital / 2 Wireless</strong> Comm Systems</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span><strong>4 Internet Providers</strong> (Maranet, IGAN, etc.)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span><strong>8 Active Radio</strong> Broadcast Stations</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span><strong>4 Newspaper</strong> Publications</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

        </Section>
    );
}
