'use client'

import { useState, useMemo } from 'react';
import { MapPin, User, Phone, Mail, Users, Search } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import FilterGrid from '@/components/ui/FilterGrid';
import ReferencesFooter from '@/components/ui/ReferencesFooter';
// Adjust this import path based on where you save your barangay JSON data
import allBarangays from '@/data/iligan/barangay.json';

type SortOption = 'A-Z (Alphabetical)' | 'Z-A (Alphabetical)' | 'Population: High to Low' | 'Population: Low to High';

const SORT_OPTIONS: SortOption[] = [
    'A-Z (Alphabetical)',
    'Z-A (Alphabetical)',
    'Population: High to Low',
    'Population: Low to High'
];

export default function BarangaysClient() {
    // Instead of category filtering, we use a search query for Barangays
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSort, setActiveSort] = useState<SortOption>('A-Z (Alphabetical)');

    const barangayReferences = [
        {
            title: "iligan.gov.ph - Brangays",
            url: "https://iligan.gov.ph/forresidents/barangays?1715183843"
        }
    ]


    // 1. Filter AND Sort the data using useMemo for performance
    const processedBarangays = useMemo(() => {
        // First, filter by search query
        const result = allBarangays.filter(barangay =>
            barangay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            barangay.representative.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Then, sort the filtered result based on the activeSort state
        result.sort((a, b) => {
            // Helper function to safely parse population strings (e.g., "6,506" -> 6506)
            const parsePop = (popString: string) => parseInt(popString.replace(/,/g, ''), 10) || 0;

            switch (activeSort) {
                case 'A-Z (Alphabetical)':
                    return a.name.localeCompare(b.name);
                case 'Z-A (Alphabetical)':
                    return b.name.localeCompare(a.name);
                case 'Population: High to Low':
                    return parsePop(b.population) - parsePop(a.population);
                case 'Population: Low to High':
                    return parsePop(a.population) - parsePop(b.population);
                default:
                    return 0;
            }
        });

        return result;
    }, [searchQuery, activeSort]); // Re-run when query or sort changes

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                        Local Units
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Barangay Directory</SubpageHero.Title>
                <SubpageHero.Description>
                    Explore the official directory of Iligan City&apos;s 44 barangays, including contact information for local offices and Punong Barangays.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="container mx-auto px-4 md:px-6 py-12">

                {/* Search Bar Container */}
                <div className="container mx-auto px-4 md:px-6 pt-8">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for a barangay or official's name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Main Layout using your FilterGrid */}
                <FilterGrid>
                    <FilterGrid.Sidebar
                        title="Sort Barangays"
                        categories={SORT_OPTIONS}
                        activeCategory={activeSort}
                        onCategoryChange={(sort) => setActiveSort(sort as SortOption)}
                    />

                    <FilterGrid.Content
                        title={searchQuery ? `Search Results for "${searchQuery}"` : "All Barangays"}
                        itemCount={processedBarangays.length}
                        columns={3}
                    >
                        {processedBarangays.map((barangay, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full"
                            >
                                {/* Header: Name & Population */}
                                <div className="mb-5 pb-5 border-b border-slate-100">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                            Brgy. {barangay.name}
                                        </h3>
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                                        <Users className="w-3.5 h-3.5" />
                                        {barangay.population} Residents
                                    </div>
                                </div>

                                {/* Body: Representative & Contacts */}
                                <div className="space-y-4 flex-grow">

                                    {/* Representative */}
                                    {barangay.representative?.name && (
                                        <div className="flex items-start gap-3">
                                            <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Punong Barangay</p>
                                                <p className="text-sm font-semibold text-slate-800 leading-tight">
                                                    {barangay.representative.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone Numbers */}
                                    {barangay.numbers && barangay.numbers.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Hotlines</p>
                                                {barangay.numbers.map((num, i) => (
                                                    <a
                                                        key={i}
                                                        href={`tel:${num.replace(/[^0-9+]/g, '')}`}
                                                        className="block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {num}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Emails */}
                                    {barangay.emails && barangay.emails.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Email</p>
                                                {barangay.emails.map((email, i) => (
                                                    <a
                                                        key={i}
                                                        href={`mailto:${email}`}
                                                        className="block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
                                                    >
                                                        {email}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {processedBarangays.length === 0 && (
                            <div className="w-full py-16 flex flex-col items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-2xl border-dashed">
                                <Search className="w-8 h-8 mb-3 text-slate-300" />
                                <p className="text-lg font-medium">No barangays found</p>
                                <p className="text-sm mt-1">Try adjusting your search query.</p>
                            </div>
                        )}
                    </FilterGrid.Content>
                </FilterGrid>

                <ReferencesFooter className='mx-4' references={barangayReferences} />
            </div>

        </main>
    );
}
