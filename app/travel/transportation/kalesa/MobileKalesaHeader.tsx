"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { KalesaRoute } from "./type";

interface MobileKalesaHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredRoutes: KalesaRoute[];
  setActiveRouteId: (id: string | null) => void;
}

export default function MobileKalesaHeader({
  searchQuery,
  setSearchQuery,
  filteredRoutes,
  setActiveRouteId,
}: MobileKalesaHeaderProps) {
  // Grab only the top 3 routes for the mobile dropdown
  const topMatches = filteredRoutes.slice(0, 3);

  return (
    <div className="pointer-events-none absolute top-3 left-3 z-[1000] w-[calc(100vw-1.5rem)] md:hidden">
      <div className="flex gap-2">
        {/* BetterIligan Home Link */}
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

        {/* Search & Dropdown Wrapper */}
        <div className="relative flex-1">
          <div className="pointer-events-auto flex h-12 w-full items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-lg">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kalesa routes..."
              aria-label="Search kalesa routes"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Matches Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 pointer-events-auto absolute top-14 right-0 left-0 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl duration-200">
              <ul className="flex flex-col">
                {topMatches.map((route) => {
                  const displayCode = route.routeId;
                  const routeColor = route.routeColor || "#3B82F6";

                  return (
                    <li key={route.routeId}>
                      <button
                        className="flex w-full items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                        onClick={() => {
                          setActiveRouteId(route.routeId);
                          setSearchQuery(""); // Clear search to dismiss the dropdown
                        }}
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg px-1 text-center text-[10px] leading-none font-bold text-white shadow-sm"
                          style={{ backgroundColor: routeColor }}
                        >
                          {displayCode}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-slate-900">
                            {route.name}
                          </div>
                          <div
                            className="mt-0.5 text-[10px] font-bold tracking-wider uppercase"
                            style={{ color: routeColor }}
                          >
                            Route {route.routeId}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}

                {topMatches.length === 0 && (
                  <li className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                    No routes found.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
