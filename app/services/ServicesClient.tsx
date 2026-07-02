'use client'

import { useState, useMemo, useEffect, Suspense, useDeferredValue } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, PlusCircle } from 'lucide-react';

import { allServices } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import FilterGrid from '@/components/ui/FilterGrid';
import ContributionModal from '@/components/ui/ContributionModal';

function ServicesDirectoryContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

    // 1. Initialize both states from the URL
    const initialCategory = searchParams.get('category') || 'All Services';
    const initialQuery = searchParams.get('q') || '';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const deferredSearchQuery = useDeferredValue(searchQuery);

    // Dynamically generate the list of categories based on the data
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(allServices.map((s) => s.category)));
        return ['All Services', ...uniqueCategories.sort()];
    }, []);

    // 2. Centralized URL Updater
    const updateUrl = (category: string, query: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (category === 'All Services') {
            params.delete('category');
        } else {
            params.set('category', category);
        }

        if (query.trim() === '') {
            params.delete('q');
        } else {
            params.set('q', query);
        }

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        window.history.replaceState(null, '', newUrl);
    };

    // 3. Debounce Effect for Search URL updating
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateUrl(selectedCategory, searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        setSelectedCategory(
            searchParams.get('category') || 'All Services'
        );

        setSearchQuery(
            searchParams.get('q') || ''
        );
    }, [searchParams]);


    // 4. Update Handlers (Notice how lightweight they are now!)
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All Services');
    };

    // Filter services based on search text AND selected category
    const filteredServices = useMemo(() => {
        const query = deferredSearchQuery.toLowerCase();

        return allServices.filter((service) => {
            const matchesSearch =
                service.title.toLowerCase().includes(query) ||
                service.description.toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === 'All Services' ||
                service.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [deferredSearchQuery, selectedCategory]);

    return (
        <main className="min-h-screen bg-[#F8FAFC] font-sans pb-24">

            <section className="pt-12 pb-4 sm:pt-16 sm:pb-8 md:pt-20 md:pb-12 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Local Government Services
                </h1>
                <p className="text-[14px] sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10">
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

            <FilterGrid className='py-0! md:py-0!'>

                {/* Left Sidebar: Categories */}
                <FilterGrid.Sidebar
                    title="Categories"
                    categories={categories} // Assuming 'categories' is defined above in your code
                    activeCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Right Content: Results & Cards */}
                <FilterGrid.Content
                    title={selectedCategory}
                    itemCount={filteredServices.length}
                    columns={2}
                >
                    {filteredServices.length > 0 ? (
                        <>
                            {filteredServices.map((service, idx) => (
                                <ServiceCard key={`service-${idx}`} service={service} />
                            ))}

                            {/* Missing Service CTA - Injected into the grid like a card! */}
                            <div
                                onClick={() => setIsContributionModalOpen(true)}
                                className="bg-[#F8FAFC] border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer rounded-2xl p-6 h-full flex flex-col justify-center transition-all group"
                            >
                                <div className="flex items-center gap-2 text-slate-800 group-hover:text-blue-700 font-bold mb-2 transition-colors">
                                    <PlusCircle className="w-5 h-5" />
                                    Contribute or Report a Fix
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                    Notice missing information or an outdated procedure? Help your fellow citizens by updating the directory.
                                </p>
                                <div className="mt-auto block w-full text-center py-2.5 bg-white border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 text-slate-700 text-sm font-bold rounded-lg transition-colors shadow-sm">
                                    Submit Information
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State - Span across all columns */
                        <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No services found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                We couldn&apos;t find any services matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-6 text-blue-600 font-semibold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </FilterGrid.Content>
            </FilterGrid>

            <ContributionModal
                isOpen={isContributionModalOpen}
                onClose={() => setIsContributionModalOpen(false)}
            />
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
