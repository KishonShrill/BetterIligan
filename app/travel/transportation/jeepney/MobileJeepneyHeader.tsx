"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

interface MobileJeepneyHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MobileJeepneyHeader({
  searchQuery,
  setSearchQuery,
}: MobileJeepneyHeaderProps) {
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-1000 w-[calc(100vw-1.5rem)] md:hidden">
      <div className="flex gap-2">
        {/* BetterIligan Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="BetterIligan home"
            className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg transition-opacity hover:opacity-80"
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
        <div className="pointer-events-auto flex h-12 w-full items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-lg">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jeepney routes..."
            aria-label="Search jeepney routes"
            className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
