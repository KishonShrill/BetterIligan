'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpRight, FileText, Landmark, X } from 'lucide-react';
import Section from '@/components/ui/Section';
import Button3D from '@/components/ui/Button3D';

// Import your centralized services array!
import { allServices } from '@/data/services';
import { AllService } from '@/validations/serviceSchema';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AllService[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // NEW STATE: Controls whether the full search card is visible on mobile
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    // Reference to the search container to detect clicks outside
    const router = useRouter();
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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

    // When mobile search opens, automatically focus the input
    useEffect(() => {
        if (isMobileSearchVisible && mobileSearchInputRef.current) {
            // Small delay to allow the animation to render first
            setTimeout(() => {
                mobileSearchInputRef.current?.focus();
            }, 50);
        }
    }, [isMobileSearchVisible]);

    // Helper to handle popular search clicks
    const handlePopularSearch = (term: string) => {
        setSearchQuery(term);
        // If they click a popular search on mobile BEFORE opening the search box, 
        // open the search box so they can see the results!
        if (!isMobileSearchVisible && window.innerWidth < 1024) {
            setIsMobileSearchVisible(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsDropdownOpen(false);

            if (searchQuery.trim()) {
                router.push(`/services?q=${encodeURIComponent(searchQuery)}`);
            } else {
                router.push('/services');
            }
        }
    };

    return (
        <Section className='bg-[#0038A8] max-md:py-3'>
            {/* Subtle Background Grid for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative max-w-404 mx-auto py-8 md:py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">

                {/* Status Badge */}
                <div className="max-lg:hidden col-span-1 lg:col-span-2 w-fit mx-auto lg:mx-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
                    </span>
                    Citizen Portal Active
                </div>

                {/* Left Column */}
                <div className="max-w-404 mx-auto lg:mx-0 text-center lg:text-left">
                    <h1 className="max-lg:text-left text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                        Welcome to <br /> BetterIligan City
                    </h1>

                    <p className="max-lg:max-w-lg max-lg:text-left text-blue-100 text-base lg:text-lg mb-8 leading-relaxed">
                        A modernized, volunteer-driven portal to access government services, public data, and resources for the people of Iligan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-2">
                        <Button3D
                            text="Browse Services"
                            href="/services"
                            hasArrow={true}
                            variant="white"
                            size="md"
                            className="w-full sm:w-auto"
                        />

                        {/* NEW: The Mobile Reveal Search Button! Hidden on Desktop (lg) */}
                        {!isMobileSearchVisible && (
                            <Button3D
                                text="Find a Service"
                                icon={Search}
                                iconPosition='left'
                                onClick={() => setIsMobileSearchVisible(true)}
                                variant="blue"
                                size="md"
                                className="lg:hidden w-full sm:w-auto"
                            />
                        )}
                    </div>
                </div>

                {/* Right Column - Dynamic Search Card */}
                {/* Notice the conditional class handling: It's always visible on 'lg', but toggled by state on mobile */}
                <div className={`w-full max-lg:max-w-2xl mx-auto lg:mx-0 lg:ml-auto ${!isMobileSearchVisible ? 'max-lg:hidden' : 'max-lg:animate-in max-lg:fade-in max-lg:slide-in-from-bottom-4 max-lg:duration-300'}`}>

                    {/* The main Search Card UI */}
                    <div className="md:bg-white max-lg:bg-white/10 max-lg:backdrop-blur-md md:rounded-2xl rounded-xl md:shadow-2xl shadow-lg p-5 md:p-8 border border-white/20 md:border-slate-100 relative">

                        {/* Card Header & Mobile Close Button */}
                        <div className="flex items-center justify-between mb-5 md:mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 md:bg-blue-100 p-2.5 md:p-2 rounded-xl md:rounded-lg">
                                    <Search className="w-5 h-5 text-white md:text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-white md:text-slate-800">Find a Service</h2>
                            </div>

                            {/* Mobile Close Button (X) */}
                            <button
                                onClick={() => {
                                    setIsMobileSearchVisible(false);
                                    setSearchQuery(''); // Optional: clear search when closing
                                }}
                                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close search"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search Input & Dropdown Container */}
                        <div className="relative mb-6 md:mb-8 group" ref={searchContainerRef}>
                            <input
                                ref={mobileSearchInputRef} // Added ref for auto-focus
                                type="text"
                                placeholder="e.g., birth certificate, business permit"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-4 pr-16 md:pr-14 py-4 rounded-xl border-2 border-transparent md:border-slate-100 bg-white md:bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-200 shadow-xl md:shadow-none text-base relative z-10"
                            />

                            {/* Search Submit Button */}
                            <Link
                                href={`/services?q=${encodeURIComponent(searchQuery)}`}
                                aria-label="Search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-2.5 rounded-lg transition-colors z-10 flex items-center justify-center shadow-sm"
                            >
                                <ArrowUpRight className="w-5 h-5 md:w-4 md:h-4" />
                            </Link>

                            {/* FLOATING DROPDOWN RESULTS */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {searchResults.length > 0 ? (
                                        <ul className="max-h-[50vh] md:max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar p-1">
                                            {searchResults.map((service, idx) => (
                                                <li key={`service-${idx}`}>
                                                    <Link
                                                        href={service.type === "standard"
                                                            ? `/services/${service.slug}`
                                                            : service.type === "internal"
                                                                ? `/community/${service.slug}`
                                                                : service.externalUrl}
                                                        className="flex items-center justify-between p-3 md:p-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset rounded-lg transition-all group/item"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-base md:text-sm font-bold text-slate-900 group-hover/item:text-blue-700 group-focus/item:text-blue-700 transition-colors mb-0.5">
                                                                {service.title}
                                                            </span>
                                                            <span className="text-xs md:text-xs text-slate-500 mb-0.5">
                                                                {service.type !== "internal" && `${service.department} • `} {service.category}
                                                            </span>
                                                            <span className='text-xs md:text-sm text-blue-700 line-clamp-1'>
                                                                {service.type === 'standard'
                                                                    ? `betteriligancity.org/services/${service.slug}`
                                                                    : service.type === 'internal'
                                                                        ? `betteriligancity.org/community/${service.slug}`
                                                                        : service.externalUrl}
                                                            </span>
                                                        </div>
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
                            <p className="text-xs font-semibold text-blue-200 md:text-slate-400 uppercase tracking-wider mb-3">
                                Popular Searches
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Birth Certificate', icon: FileText },
                                    { name: 'Marriage Certificate', icon: FileText },
                                    { name: 'Business Permit', icon: Landmark }
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handlePopularSearch(item.name)}
                                        className="flex items-center gap-1.5 bg-white/10 md:bg-slate-50 hover:bg-white/20 md:hover:bg-blue-50 border border-white/20 md:border-slate-100 text-white md:text-slate-600 hover:text-white md:hover:text-blue-700 text-xs px-3 py-2 rounded-full transition-colors backdrop-blur-sm md:backdrop-blur-none"
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
