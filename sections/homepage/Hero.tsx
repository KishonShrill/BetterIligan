'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ArrowUpRight, FileText, Landmark, ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';

// Import your centralized services array!
import { allServices } from '@/data/services'; // Changed from categories
import { GovernmentService } from '@/validations/serviceSchema';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<GovernmentService[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Reference to the search container to detect clicks outside
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Handle the filtering logic whenever the query changes
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = allServices.filter(service =>
                service.title.toLowerCase().includes(lowerCaseQuery) ||
                service.description.toLowerCase().includes(lowerCaseQuery) ||
                service.category.toLowerCase().includes(lowerCaseQuery)
            ).slice(0, 10); // Limit to top 10 results

            setSearchResults(filtered);
            setIsDropdownOpen(true);
        } else {
            setSearchResults([]);
            setIsDropdownOpen(false);
        }
    }, [searchQuery]);

    // Handle clicks outside the search component to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to handle popular search clicks
    const handlePopularSearch = (term: string) => {
        setSearchQuery(term);
    };

    return (
        <Section className='bg-blue-600 min-h-125'>
            {/* Subtle Background Grid for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative max-w-404 mx-auto px-6 lg:px-8 py-4 md:py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

                {/* Status Badge */}
                <div className="max-lg:hidden col-span-1 lg:col-span-2 w-fit mx-auto lg:mx-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Citizen Portal Active
                </div>

                {/* Left Column */}
                <div className="max-w-404 mx-auto lg:mx-0 text-center lg:text-left">
                    <h1 className="max-lg:text-left text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                        Welcome to <br /> BetterIligan City
                    </h1>

                    <p className="max-lg:max-w-lg max-lg:text-left text-blue-100 text-lg mb-8 leading-relaxed">
                        A modernized, volunteer-driven portal to access government services, public data, and resources for the people of Iligan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <Link
                            href='/services'
                            className="group flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-lg transition-all duration-200"
                        >
                            Browse Services
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-transparent border border-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500/50 transition-all duration-200">
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* Right Column - Elevated Search Card */}
                <div className="w-full max-lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-8 border border-slate-100 relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Search className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Find a Service</h2>
                        </div>

                        {/* Search Input & Dropdown Container */}
                        <div className="relative mb-6 group" ref={searchContainerRef}>
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                            <input
                                type="text"
                                placeholder="e.g., birth certificate, business permit"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
                                className="w-full pl-3.5 md:pl-4 pr-12 py-3.5 md:py-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-200 relative z-10"
                            />

                            {/* Search Button (now acts as a quick link to the main services page with the query) */}
                            <Link
                                href={`/services?search=${encodeURIComponent(searchQuery)}`}
                                aria-label="Search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors z-10 flex items-center justify-center"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>

                            {/* FLOATING DROPDOWN RESULTS */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {searchResults.length > 0 ? (
                                        <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                                            {searchResults.map((service) => (
                                                <li key={service.slug}>
                                                    <Link
                                                        href={`/services/${service.slug}`}
                                                        className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors group/item"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        <div className="flex flex-col pr-4">
                                                            <span className="text-sm font-bold text-slate-900 group-hover/item:text-blue-700 transition-colors line-clamp-1">
                                                                {service.title}
                                                            </span>
                                                            <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                                {service.department} • {service.category}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-blue-500 shrink-0 transition-transform group-hover/item:translate-x-1" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-6 text-center text-slate-500 text-sm">
                                            No services found matching &ldquo;{searchQuery}&rdquo;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Popular Searches */}
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Popular Searches
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Birth Certificate', icon: FileText },
                                    { name: 'Marriage Certificate', icon: FileText },
                                    { name: 'Business Permit', icon: Landmark },
                                    { name: 'Real Property Tax', icon: FileText },
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handlePopularSearch(item.name)}
                                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-sm px-3.5 py-2 rounded-full transition-colors"
                                    >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
}
