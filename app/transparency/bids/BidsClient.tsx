'use client'

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import FilterGrid from '@/components/ui/FilterGrid';
import ReferencesFooter from '@/components/ui/ReferencesFooter';
import BidCard from '@/components/BidCard';
import { BidsSchema, getBidStatus } from '@/validations/bidSchema';
import rawBidsData from '@/data/iligan/bids.json';

const bidsData = BidsSchema.parse(rawBidsData);

type StatusFilter = 'All' | 'Open for Bidding' | 'Awarded' | 'Ongoing';

export default function BidsClient() {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return bidsData.entries.filter((b) => {
            const status = getBidStatus(b.stages);
            const matchesStatus = selectedStatus === 'All' || status === selectedStatus;
            const matchesSearch =
                b.title.toLowerCase().includes(query) ||
                b.reference.toLowerCase().includes(query) ||
                b.office.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [selectedStatus, searchQuery]);

    const bidsReferences = [
        {
            title: 'City Government of Iligan — Bids & Procurement',
            url: 'https://iligan.gov.ph/transparency/bidsandprocurement',
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/transparency' text='Back to Transparency' />
            <SubpageHero>
                <SubpageHero.Title>Bids & Procurement</SubpageHero.Title>
                <SubpageHero.Description>
                    Every open, awarded, and in-progress procurement from the City Government of
                    Iligan — with a direct link to the actual bid documents for each stage.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="container mx-auto px-4 md:px-6 pt-6">
                <div className="max-w-2xl mx-auto relative group mb-2">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title, bid reference, or office..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-base"
                    />
                </div>
                <div className="flex justify-center mb-4">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 flex-wrap">
                        {(['All', 'Open for Bidding', 'Awarded', 'Ongoing'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSelectedStatus(s)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${selectedStatus === s ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <FilterGrid className='py-0! md:py-0!'>
                <FilterGrid.Content
                    title="Procurement Projects"
                    itemCount={filtered.length}
                    hasSidebar={false}
                >
                    {filtered.length > 0 ? (
                        <div className="col-span-full flex flex-col gap-4">
                            {filtered.map((b) => <BidCard key={b.reference} bid={b} />)}
                        </div>
                    ) : (
                        <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No procurement projects found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                Try a different search term or status.
                            </p>
                        </div>
                    )}
                </FilterGrid.Content>
            </FilterGrid>

            <div className="container mx-auto px-4 md:px-6">
                <ReferencesFooter
                    references={bidsReferences}
                    disclaimer="Every project listed here was individually verified against the city's live Bids & Procurement page, with each stage document (ITB/NOA/NTP) confirmed as a real, reachable PDF before being added."
                />
            </div>
        </main>
    );
}
