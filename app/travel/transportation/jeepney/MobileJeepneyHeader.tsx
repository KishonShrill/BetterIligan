'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface MobileJeepneyHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function MobileJeepneyHeader({
    searchQuery,
    setSearchQuery,
}: MobileJeepneyHeaderProps) {
    return (
        <div className="md:hidden absolute top-3 left-3 z-1000 w-[calc(100vw-1.5rem)] pointer-events-none">
            <div className="flex gap-2">

                {/* BetterIligan Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        aria-label="BetterIligan home"
                        className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-lg border border-slate-200 transition-opacity hover:opacity-80"
                    >
                        <Image
                            src="/images/logos/betteriligan-logo.png"
                            alt="BetterIligan"
                            width={28}
                            height={28}
                            className="h-7 w-7 shrink-0 object-contain"
                        />
                    </Link>
                </div>

                {/* Search */}
                <div
                    className="pointer-events-auto flex items-center w-full h-12
                                px-3 rounded-2xl bg-white shadow-lg border border-slate-200"
                >
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jeepney routes..."
                        aria-label="Search jeepney routes"
                        className="flex-1 min-w-0 h-full px-2.5 bg-transparent outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    />
                </div>

            </div>
        </div>
    );
}
