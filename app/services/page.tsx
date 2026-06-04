'use client'

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, FileText, CheckCircle, ArrowRight, PlusCircle } from 'lucide-react';
import { GovernmentService } from '@/types/service';

import servicesData from '@/data/services.json';

const allServices = servicesData as GovernmentService[];

export default function ServicesDirectoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Services');

    // Dynamically generate the list of categories based on the data
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(allServices.map((s) => s.category)));
        return ['All Services', ...uniqueCategories.sort()];
    }, []);

    // Filter services based on search text AND selected category
    const filteredServices = useMemo(() => {
        return allServices.filter((service) => {
            const matchesSearch =
                service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'All Services' || service.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <main className="min-h-screen bg-[#F8FAFC] font-sans pb-24">

            {/* Hero Section & Search */}
            <section className="py-16 md:py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Local Government Services
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
                    Explore official municipal services from the Citizens Charter and community contributions. Choose a category to filter or search below.
                </p>

                <div className="max-w-2xl mx-auto relative group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for services (e.g., Business Permit)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-base"
                    />
                </div>
            </section>

            {/* Main Layout Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Sidebar: Categories */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Categories</h3>
                        </div>
                        <ul className="flex flex-col">
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${selectedCategory === category
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Missing Service CTA */}
                    <div className="bg-[#FFF8F1] border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                            <PlusCircle className="w-5 h-5" />
                            Missing a service?
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            BetterIliganCity is community-maintained. Help your fellow citizens by suggesting a new service directory.
                        </p>
                        <Link
                            href="/suggest"
                            className="block w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Suggest New Service
                        </Link>
                    </div>
                </div>

                {/* Right Content: Results & Cards */}
                <div className="lg:col-span-9">

                    {/* Results Count & Active Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">{selectedCategory}</h2>
                        <div className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500 tracking-wide shadow-sm">
                            {filteredServices.length} RESULTS
                        </div>
                    </div>

                    {/* Cards Grid */}
                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredServices.map((service) => (
                                <Link href={`/services/${service.slug}`} key={service.slug} className="group">
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full flex flex-col">

                                        {/* Top Row: Icon & Pills */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex gap-2">
                                                {service.source === 'official' ? (
                                                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                        Official
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                                        Community
                                                    </span>
                                                )}
                                                {service.isWalkIn && (
                                                    <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                                                        Walk-In
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Middle: Content */}
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                {service.category}
                                            </p>
                                            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {service.department}
                                            </p>
                                        </div>

                                        {/* Bottom Row: Status & CTA */}
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-emerald-600">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">
                                                    {service.source === 'official' ? 'Official Data' : 'Community Data'}
                                                </span>
                                            </div>
                                            <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                View <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (

                        /* Empty State */
                        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No services found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                We couldn't find any services matching "{searchQuery}" in {selectedCategory}.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All Services'); }}
                                className="mt-6 text-blue-600 font-semibold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
