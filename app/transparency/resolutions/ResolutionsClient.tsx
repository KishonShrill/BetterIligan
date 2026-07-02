'use client'

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import FilterGrid from '@/components/ui/FilterGrid';
import ResolutionCard from '@/components/ResolutionCard';
import { ResolutionsSchema } from '@/validations/resolutionSchema';
import rawResolutionsData from '@/data/iligan/resolutions.json';

const resolutionsData = ResolutionsSchema.parse(rawResolutionsData);

type TypeFilter = 'all' | 'resolution' | 'ordinance';

export default function ResolutionsClient() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState<TypeFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = useMemo(() => {
        const unique = Array.from(new Set(resolutionsData.entries.map((r) => r.category)));
        return ['All', ...unique.sort()];
    }, []);

    const filtered = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return resolutionsData.entries.filter((r) => {
            const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
            const matchesType = selectedType === 'all' || r.type === selectedType;
            const matchesSearch =
                r.title.toLowerCase().includes(query) ||
                r.summary.toLowerCase().includes(query) ||
                r.number.includes(query);
            return matchesCategory && matchesType && matchesSearch;
        });
    }, [selectedCategory, selectedType, searchQuery]);

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/transparency' text='Back to Transparency' />
            <SubpageHero>
                <SubpageHero.Title>City Resolutions & Ordinances</SubpageHero.Title>
                <SubpageHero.Description>
                    What the Sangguniang Panlungsod has actually passed — sourced directly from official
                    city records, linking to the real document for every entry. Covers {resolutionsData.years.join(', ')}
                    {' '}so far, and grows as more are verified.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="container mx-auto px-4 md:px-6 pt-6">
                <div className="max-w-2xl mx-auto relative group mb-2">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title or resolution/ordinance number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-base"
                    />
                </div>
                <div className="flex justify-center mb-4">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                        {(['all', 'resolution', 'ordinance'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedType(t)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors capitalize ${selectedType === t ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {t === 'all' ? 'All Types' : `${t}s`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <FilterGrid className='py-0! md:py-0!'>
                <FilterGrid.Sidebar
                    title="Categories"
                    categories={categories}
                    activeCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                <FilterGrid.Content
                    title={selectedCategory}
                    itemCount={filtered.length}
                    columns={2}
                >
                    {filtered.length > 0 ? (
                        filtered.map((r) => <ResolutionCard key={r.number} resolution={r} />)
                    ) : (
                        <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No resolutions found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                Try a different search term or category.
                            </p>
                        </div>
                    )}
                </FilterGrid.Content>
            </FilterGrid>
        </main>
    );
}
