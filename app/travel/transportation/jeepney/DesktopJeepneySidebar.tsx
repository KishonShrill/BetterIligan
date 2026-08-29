'use client'

import { Map as MapIcon, X } from 'lucide-react';
import type { JeepneyRoute } from './types';

interface DesktopJeepneySidebarProps {
    sidebarPhase: 'closed' | 'peek' | 'open';
    isClosing: boolean;
    toggleSidebar: () => void;
    routes: JeepneyRoute[];
    activeRouteId: string | null;
    setActiveRouteId: (id: string | null) => void;
    getRouteColor: (routeId: string, fallbackStroke?: string) => string;
    searchQuery: string;
}

export default function DesktopJeepneySidebar({
    sidebarPhase,
    isClosing,
    toggleSidebar,
    routes,
    activeRouteId,
    setActiveRouteId,
    getRouteColor,
    searchQuery
}: DesktopJeepneySidebarProps) {

    // Dynamically adjust the transition speed based on the current animation phase
    const sidebarStyle = {
        transitionProperty: "width, height, border-radius",
        transitionDuration: (sidebarPhase === 'peek' && !isClosing) || (sidebarPhase === 'closed' && isClosing)
            ? "250ms"  // Faster for horizontal expansions/shrinks
            : "350ms", // Slower, smoother drop for vertical roll-ups/downs
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
    };

    // Helper booleans for clean rendering
    const isExpanded = sidebarPhase !== 'closed';
    const isFullyOpen = sidebarPhase === 'open';

    return (
        <div
            style={sidebarStyle}
            className={`max-md:hidden absolute top-4 left-4 z-[1000] pointer-events-auto bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden
            ${sidebarPhase === 'open'
                    ? 'w-80 h-[calc(100dvh-2rem)] rounded-2xl'
                    : sidebarPhase === 'peek'
                        ? 'w-80 h-[77px] rounded-2xl'
                        : 'w-48 h-[56px] rounded-2xl cursor-pointer hover:bg-slate-50'
                }`}
        >
            {/* Sidebar Header / Collapsed Button */}
            <div
                onClick={() => sidebarPhase === 'closed' && toggleSidebar()}
                className={`flex items-center justify-between shrink-0 transition-colors duration-300 ${isExpanded
                    ? 'p-4 border-b border-slate-100 bg-slate-50'
                    : 'w-full h-full px-4 justify-start'
                    }`}
            >
                <div
                    className={`flex items-center gap-3 ${!isExpanded && 'w-full justify-start'
                        }`}
                >
                    {!isExpanded && (
                        <MapIcon className="w-5 h-5 text-blue-600 shrink-0" />
                    )}

                    <div className="whitespace-nowrap block">
                        <h2
                            className={`font-bold text-slate-900 transition-all duration-300 ${isExpanded ? 'text-lg' : 'text-sm'
                                }`}
                        >
                            Jeepney Routes
                        </h2>

                        <div
                            className={`text-xs text-slate-500 overflow-hidden transition-all duration-300 ${isExpanded
                                ? 'max-h-10 opacity-100 mt-0.5'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            Select a route to check the fare
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSidebar();
                        }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors shrink-0"
                        title="Close Sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Sidebar Body */}
            <div
                className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out ${isFullyOpen
                    ? 'opacity-100 visible delay-150'
                    : 'opacity-0 invisible delay-0'
                    }`}
            >
                {routes.length > 0 ? (
                    <ul className="p-3 space-y-2">
                        {routes.map((route) => {
                            const isActive = activeRouteId === route.routeId;

                            /*
                             * Use the route's configured color if available.
                             * For missing GeoJSON routes, getRouteColor can still
                             * provide a fallback based on the route ID.
                             */
                            const routeColor = getRouteColor(
                                route.routeId,
                                route.routeColor
                            );

                            return (
                                <li key={route.routeId}>
                                    <button
                                        onClick={() => {
                                            setActiveRouteId(
                                                isActive
                                                    ? null
                                                    : route.routeId
                                            );
                                        }}
                                        style={{
                                            borderLeftColor: routeColor,
                                            borderLeftWidth: 4
                                        }}
                                        className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all ${isActive
                                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Route Code */}
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm px-1 text-center leading-none ${!route.hasGeoJson
                                                    ? 'opacity-50'
                                                    : ''
                                                    }`}
                                                style={{
                                                    backgroundColor: routeColor
                                                }}
                                            >
                                                {route.routeId}
                                            </div>

                                            {/* Route Information */}
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 leading-tight truncate">
                                                    {route.name}
                                                </div>

                                                <div
                                                    className="text-[10px] font-bold tracking-wider uppercase mt-0.5"
                                                    style={{
                                                        color: routeColor
                                                    }}
                                                >
                                                    Route {route.routeId}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Missing GeoJSON */}
                                        {!route.hasGeoJson && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />

                                                <span className="text-xs font-semibold text-slate-500">
                                                    Route map not yet available
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No routes found matching{' '}
                        <span className="font-bold text-slate-700">
                            &ldquo;{searchQuery}&rdquo;
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
