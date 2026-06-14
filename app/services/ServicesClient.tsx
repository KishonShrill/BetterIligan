'use client'

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, PlusCircle } from 'lucide-react';

import { allServices } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';

function ServicesDirectoryContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Initialize both states from the URL
    const initialCategory = searchParams.get('category') || 'All Services';
    const initialQuery = searchParams.get('q') || '';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // 2. Sync state if the user uses the browser's Back/Forward buttons to navigate across pages
    useEffect(() => {
        const currentCategory = searchParams.get('category') || 'All Services';
        const currentQuery = searchParams.get('q') || '';
        setSelectedCategory(currentCategory);
        setSearchQuery(currentQuery);
    }, [searchParams]);

    // Dynamically generate the list of categories based on the data
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(allServices.map((s) => s.category)));
        return ['All Services', ...uniqueCategories.sort()];
    }, []);

    // 3. Centralized URL Updater
    const updateUrl = (category: string, query: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Handle Category Param
        if (category === 'All Services') {
            params.delete('category');
        } else {
            params.set('category', category);
        }

        // Handle Search Param
        if (query.trim() === '') {
            params.delete('q');
        } else {
            params.set('q', query);
        }

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

        // replaceState is the magic here! It updates the URL in the address bar 
        // without adding 50 new entries to the user's back button history while they type.
        window.history.replaceState(null, '', newUrl);
    };

    // 4. Update Handlers
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateUrl(category, searchQuery); // Preserve the current search query
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        updateUrl(selectedCategory, query); // Preserve the current category
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All Services');
        updateUrl('All Services', '');
    };

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
                        onChange={handleSearchChange} /* Updated to use the new handler */
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-base"
                    />
                </div>
            </section>

            {/* Main Layout Grid */}
            <div className="max-w-404 mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

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
                                        onClick={() => handleCategoryChange(category)}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-5">
                            {filteredServices.map((service, idx) => (
                                <ServiceCard key={`service-${idx}`} service={service} />
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
                                We couldn&apos;t find any services matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
                            </p>
                            <button
                                onClick={clearFilters} /* Updated to use the new clear helper */
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

export default function ServicesClient() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]"></div>}>
            <ServicesDirectoryContent />
        </Suspense>
    );
}
