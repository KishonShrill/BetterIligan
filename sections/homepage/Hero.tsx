'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, FileText, Landmark, ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import Button3D from '@/components/ui/Button3D';

// Import your centralized services array!
import { allServices } from '@/data/services';
import { AllService } from '@/validations/serviceSchema';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AllService[]>([]);
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
                service.category.toLowerCase().includes(lowerCaseQuery) ||
                service.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
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

            <div className="relative max-w-404 mx-auto px-6 lg:px-8 py-8 md:py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

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
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                        <Button3D
                            text="Browse Services"
                            href="/services"
                            hasArrow={true}
                            variant="white"
                            size="md"
                            className="w-full md:w-auto"
                        />
                    </div>
                </div>

                {/* Right Column - Dynamic Search Card */}
                <div className="w-full max-lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                    {/* Note: The background, border, and shadow are removed on mobile to save space, but added back on md: screens */}
                    <div className="md:bg-white md:rounded-2xl md:shadow-2xl md:p-8 md:border md:border-slate-100 relative">

                        <div className="flex items-center gap-3 mb-5 md:mb-6">
                            {/* Icon adjusts color based on mobile (translucent white) or desktop (light blue) */}
                            <div className="bg-white/20 md:bg-blue-100 p-2.5 md:p-2 rounded-xl md:rounded-lg backdrop-blur-sm md:backdrop-blur-none">
                                <Search className="w-5 h-5 text-white md:text-blue-600" />
                            </div>
                            <h2 className="text-2xl md:text-xl font-bold text-white md:text-slate-800">Find a Service</h2>
                        </div>

                        {/* Search Input & Dropdown Container */}
                        <div className="relative mb-6 md:mb-8 group" ref={searchContainerRef}>
                            <input
                                type="text"
                                placeholder="e.g., birth certificate, business permit"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
                                // Inputs are massively upscaled on mobile (py-4, pl-14, text-lg) for better touch targets
                                className="w-full pl-4 pr-16 md:pr-14 py-4 md:py-4 rounded-2xl md:rounded-xl border-2 border-transparent md:border-slate-100 bg-white md:bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-200 shadow-xl md:shadow-none text-lg md:text-base relative z-10"
                            />

                            {/* Search Button */}
                            <Link
                                href={`/services?search=${encodeURIComponent(searchQuery)}`}
                                aria-label="Search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-2.5 rounded-xl md:rounded-lg transition-colors z-10 flex items-center justify-center shadow-sm"
                            >
                                <ArrowUpRight className="w-5 h-5 md:w-4 md:h-4" />
                            </Link>

                            {/* FLOATING DROPDOWN RESULTS */}
                            {isDropdownOpen && (
                                // Makes dropdown wider than the search bar on desktop using negative left/right margins (md:-left-4 md:-right-4)
                                <div className="absolute top-full left-0 right-0 md:-left-4 md:-right-4 mt-3 md:mt-2 bg-white rounded-2xl md:rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {searchResults.length > 0 ? (
                                        <ul className="max-h-[60vh] md:max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                                            {searchResults.map((service, idx) => (
                                                <li key={`service-${idx}`}>
                                                    <Link
                                                        href={service.type === "standard"
                                                            ? `/services/${service.slug}`
                                                            : service.type === "internal"
                                                                ? `/community/${service.slug}`
                                                                : service.externalUrl}
                                                        className="flex items-center justify-between p-5 md:p-4 hover:bg-blue-50 transition-colors group/item"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        <div className="flex flex-col pr-4">
                                                            <span className="text-base md:text-sm font-bold text-slate-900 group-hover/item:text-blue-700 transition-colors line-clamp-1 mb-0.5">
                                                                {service.title}
                                                            </span>
                                                            <span className="text-sm md:text-xs text-slate-500 line-clamp-1">
                                                                {service.type !== "internal" && `${service.department} • `} {service.category}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 md:w-4 md:h-4 text-slate-300 group-hover/item:text-blue-500 shrink-0 transition-transform group-hover/item:translate-x-1" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-8 md:p-6 text-center text-slate-500 text-base md:text-sm">
                                            No services found matching &ldquo;{searchQuery}&rdquo;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Popular Searches */}
                        <div>
                            {/* Text turns light blue on mobile, slate on desktop */}
                            <p className="text-xs font-semibold text-blue-200 md:text-slate-400 uppercase tracking-wider mb-3">
                                Popular Searches
                            </p>
                            <div className="flex flex-wrap gap-2.5 md:gap-2">
                                {[
                                    { name: 'Birth Certificate', icon: FileText },
                                    { name: 'Marriage Certificate', icon: FileText },
                                    { name: 'Business Permit', icon: Landmark }
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handlePopularSearch(item.name)}
                                        // Pills become translucent buttons on mobile, standard gray buttons on desktop
                                        className="flex items-center gap-1.5 bg-white/10 md:bg-slate-50 hover:bg-white/20 md:hover:bg-blue-50 border border-white/20 md:border-slate-100 text-white md:text-slate-600 hover:text-white md:hover:text-blue-700 text-sm px-4 py-2.5 md:py-2 rounded-full transition-colors backdrop-blur-sm md:backdrop-blur-none"
                                    >
                                        <item.icon className="w-4 h-4 md:w-3.5 md:h-3.5" />
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
