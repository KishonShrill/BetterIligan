'use client'

import { useMemo, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation, ExternalLink, Ruler, Droplets } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import type { Waterfall } from '@/validations/waterfallSchema';

const WaterfallsMap = dynamic(() => import('./WaterfallsMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[380px] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-500 font-medium">
            Loading map…
        </div>
    ),
});

function mapsUrl(f: Waterfall) {
    return `https://www.google.com/maps/dir/?api=1&destination=${f.lat}%2C${f.lon}`;
}

export default function WaterfallsClient({ falls }: { falls: Waterfall[] }) {
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return falls;
        return falls.filter(
            (f) =>
                f.name.toLowerCase().includes(q) ||
                (f.area ?? '').toLowerCase().includes(q) ||
                (f.description ?? '').toLowerCase().includes(q),
        );
    }, [falls, query]);

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <SubpageNav href="/travel" text="Back to Travel" />
            <SubpageHero>
                <SubpageHero.Title>Waterfalls</SubpageHero.Title>
                <SubpageHero.Description>
                    The falls that give Iligan its name — the City of Majestic
                    Waterfalls. Locations, photos, and directions for each.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
                <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="h-[380px] w-full">
                        <WaterfallsMap falls={falls} />
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search waterfalls…"
                        aria-label="Search waterfalls"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visible.map((f) => (
                        <article
                            key={f.name}
                            className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="relative aspect-[4/3] bg-cyan-50">
                                {f.photo ? (
                                    <Image
                                        src={f.photo.url}
                                        alt={f.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-600/70">
                                        <Droplets className="w-10 h-10" aria-hidden />
                                        <span className="text-xs font-semibold mt-1">Photo needed</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <h2 className="text-lg font-bold text-slate-900">{f.name}</h2>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {f.area && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" aria-hidden /> {f.area}
                                        </span>
                                    )}
                                    {f.height && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700">
                                            <Ruler className="w-3.5 h-3.5" aria-hidden /> {f.height}
                                        </span>
                                    )}
                                </div>

                                {f.description ? (
                                    <p className="text-sm text-slate-600 leading-relaxed mt-3 flex-1">{f.description}</p>
                                ) : (
                                    <div className="flex-1" />
                                )}

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <a
                                        href={mapsUrl(f)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition-colors"
                                    >
                                        <Navigation className="w-3.5 h-3.5" aria-hidden /> Directions
                                    </a>
                                    {f.reference && (
                                        <a
                                            href={f.reference}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" aria-hidden /> Learn more
                                        </a>
                                    )}
                                </div>

                                <div className="mt-3 space-y-0.5">
                                    {f.photo && (
                                        <p className="text-[10px] text-slate-400">
                                            Photo:{' '}
                                            <a href={f.photo.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                                                {f.photo.credit}
                                            </a>{' '}
                                            · {f.photo.license}
                                        </p>
                                    )}
                                    {f.source && (
                                        <p className="text-[10px] text-slate-400">
                                            Location:{' '}
                                            <a href={f.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                                                OpenStreetMap
                                            </a>{' '}
                                            · verified {f.verifiedAt}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {visible.length === 0 && (
                    <p className="text-center text-slate-400 py-8">No waterfalls match “{query}”.</p>
                )}

                <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
                    Coordinates are community-sourced from OpenStreetMap and are approximate — always travel with a
                    local guide, especially to the upland falls. Photos are from Wikimedia Commons and Flickr,
                    credited per card under their respective Creative Commons / public-domain licenses.
                </p>
            </div>
        </main>
    );
}
