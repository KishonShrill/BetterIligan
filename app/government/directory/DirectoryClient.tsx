'use client'

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Globe, Facebook, Building } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { allAgencies } from '@/data/government';
import { AgencyCategory } from '@/validations/agencySchema';
import FilterGrid from '@/components/ui/FilterGrid';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

const CATEGORIES: ('All Agencies' | AgencyCategory)[] = [
    'All Agencies',
    'National Agencies',
    'LGU Offices',
    'GOCCs',
    'Constitutional Commissions',
    'Programs & Associations'
];

export default function DirectoryClient() {
    const [activeCategory, setActiveCategory] = useState<'All Agencies' | AgencyCategory>('All Agencies');

    const agenciesReferences = [{ title: "iligan.gov.ph - National Government Agencies/Offices", url: "https://iligan.gov.ph/forresidents/nationalgovernmentagenciesoffices?163429964" }]

    const filteredAgencies = activeCategory === 'All Agencies'
        ? allAgencies
        : allAgencies.filter(agency => agency.category === activeCategory);

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                        Official Directory
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>National Agencies</SubpageHero.Title>
                <SubpageHero.Description>
                    A comprehensive directory of local and national government offices, bureaus, and corporations operating within Iligan City.
                </SubpageHero.Description>
            </SubpageHero>

            {/* Main Layout */}
            <div className='container mx-auto'>
                <FilterGrid>
                    <FilterGrid.Sidebar
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onCategoryChange={(category) => setActiveCategory(category as 'All Agencies' | AgencyCategory)}
                        title="Filter by Type"
                    />

                    <FilterGrid.Content
                        title={activeCategory}
                        itemCount={filteredAgencies.length}
                        columns={3}
                    >
                        {filteredAgencies.map((agency, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">

                                {/* Top: Logo & Category Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center relative overflow-hidden shrink-0">
                                        {agency.logoUrl ? (
                                            <Image src={agency.logoUrl} alt={agency.name} fill className="object-contain p-1" sizes="56px" />
                                        ) : (
                                            <Building className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {agency.category}
                                    </span>
                                </div>

                                {/* Middle: Title & Address */}
                                <div className="flex-1 mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                                        {agency.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 flex items-start gap-1.5">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{agency.address}</span>
                                    </p>
                                </div>

                                {/* Bottom: Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-slate-100">
                                    {/* Primary Map Button */}
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(agency.name + ' Iligan City')}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5" /> Map
                                    </a>

                                    {/* Website Button */}
                                    {agency.websiteUrl && (
                                        <a
                                            href={agency.websiteUrl} target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                                            title="Visit Website"
                                        >
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    )}

                                    {/* Facebook Button */}
                                    {agency.facebookUrl && (
                                        <a
                                            href={agency.facebookUrl} target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                                            title="Visit Facebook Page"
                                        >
                                            <Facebook className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                            </div>
                        ))}
                    </FilterGrid.Content>
                </FilterGrid>
                <ReferencesFooter className='mx-4' references={agenciesReferences} />
            </div>
        </main>
    );
}
