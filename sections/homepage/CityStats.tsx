'use client'

import Link from 'next/link';
import {
    Users, Calendar, Map, Droplets,
    Layers, TrendingUp, Compass, ArrowRight
} from 'lucide-react';
import Section from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';

export default function CityStatsSummary() {
    const quickStats = [
        {
            icon: <Users className="w-5 h-5 text-blue-600" />,
            bgIcon: "bg-blue-50 border-blue-100",
            label: "Total Population",
            value: "363,115",
            subtext: "2020 Census • 421/km² density",
        },
        {
            icon: <Map className="w-5 h-5 text-emerald-600" />,
            bgIcon: "bg-emerald-50 border-emerald-100",
            label: "Land Area",
            value: "81,337 ha",
            subtext: "813.37 square kilometers",
        },
        {
            icon: <Droplets className="w-5 h-5 text-cyan-600" />,
            bgIcon: "bg-cyan-50 border-cyan-100",
            label: "Natural Wonders",
            value: "23 Waterfalls",
            subtext: "Plus 8 springs & 15 caves",
        },
        {
            icon: <Layers className="w-5 h-5 text-purple-600" />,
            bgIcon: "bg-purple-50 border-purple-100",
            label: "Political Subdivisions",
            value: "44 Barangays",
            subtext: "Highly Urbanized City class",
        },
    ];

    return (
        <Section className="bg-blue-50 border-t border-blue-100/50">

            {/* Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-5 md:gap-4">
                <div className="text-left">
                    <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5 md:mb-2">
                        Iligan At A Glance
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        City Statistics & Profile
                    </h2>
                    <Text className="text-slate-500 mt-2 max-w-xl text-sm md:text-base" size="md">
                        From vital demographics to natural resources, explore the foundational numbers that drive the City of Majestic Waterfalls.
                    </Text>
                </div>

                {/* CTA Button - Solid blue pops beautifully against blue-50 */}
                <Link
                    href="/iligan/city-stats"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-5 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group w-full md:w-auto shrink-0"
                >
                    Explore Full City Stats
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {quickStats.map((stat, idx) => (
                    <div
                        key={idx}
                        // Changed to pure white with a soft shadow and blue-tinted hover borders
                        className="bg-white border border-blue-100/50 shadow-sm rounded-2xl p-5 md:p-6 flex flex-col hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-4 mb-3 md:w-fit md:block md:mb-4">
                            <div className={`p-2.5 rounded-xl border ${stat.bgIcon} shrink-0`}>
                                {stat.icon}
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider md:hidden">
                                {stat.label}
                            </p>
                        </div>

                        <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {stat.label}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-1 md:mb-1.5 group-hover:text-blue-600 transition-colors">
                            {stat.value}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-auto">
                            {stat.subtext}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Historic Fact Banner */}
            {/* Changed to pure white background to lift it off the blue section background */}
            <div className="bg-white border border-blue-100/50 shadow-sm rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                <div className="flex items-start md:items-center gap-3 md:gap-3.5 w-full md:w-auto">
                    <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-amber-600 shrink-0 mt-1 md:mt-0">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-1">
                            <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                Foundation
                            </span>
                            <span className="text-xs md:text-sm font-bold text-slate-700">
                                Charter Date: June 16, 1950
                            </span>
                        </div>
                        <p className="text-[11px] md:text-xs text-slate-500">
                            Created under Republic Act No. 525.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-nowrap gap-3 md:gap-4 text-[11px] md:text-xs font-bold text-slate-500 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end border-slate-100">
                    <div className="flex items-center gap-1.5 flex-1 md:flex-auto justify-center md:justify-start">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">1.18% Growth</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-1.5 flex-1 md:flex-auto justify-center md:justify-start border-l border-slate-100 md:border-0 pl-3 md:pl-0">
                        <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">Cebuano Dialect</span>
                    </div>
                </div>
            </div>

        </Section>
    );
}
