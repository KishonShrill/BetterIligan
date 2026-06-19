"use client";

import Link from 'next/link';
import { ArrowRight, Navigation, HardHat } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import FilterGrid from '@/components/ui/FilterGrid';
import iliganDirectories from '@/data/navigation.json';

export default function IliganDirectories() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/' text='Go Home' />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-semibold border border-amber-200">
                        <HardHat className="w-3.5 h-3.5" /> Page is Under Construction
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Travel Directory</SubpageHero.Title>
                <SubpageHero.Description>
                    Discover places to visit, ways to get around, and where to stay while exploring Iligan City.
                </SubpageHero.Description>
            </SubpageHero>

            <FilterGrid>
                <FilterGrid.Content
                    title="Directories"
                    itemCount={iliganDirectories[2].dropdown.length}
                    columns={2}
                    hasSidebar={false}
                >
                    {iliganDirectories[2].dropdown.map((item, index) => index != 0 && (
                        <Link
                            key={index}
                            href={item.href}
                            className="group flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
                        >
                            {/* Icon Container (Matching the reference image style) */}
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Navigation className="w-6 h-6" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                                    {item.name}
                                </h3>
                                {/* Only render description if it exists in your JSON */}
                                {item.description && (
                                    <p className="text-sm text-slate-500 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Arrow Icon (Matching reference image) */}
                            <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </FilterGrid.Content>
            </FilterGrid>

        </main>
    )
};


