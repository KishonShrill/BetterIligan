'use client'

import { Banknote, GraduationCap, Map as MapIcon, X } from 'lucide-react';
import jeepneyRoutesData from '@/data/travel/jeepney-routes.json';

type JeepneyFare = {
    regular: number;
    discounted: number;
};

type JeepneyCodeEntry = {
    routeId: string;
    routeCode: string;
    routeColor?: string;
    routeFare?: JeepneyFare;
};

interface DesktopJeepneySidebarProps {
    sidebarPhase: 'closed' | 'peek' | 'open';
    isClosing: boolean;
    toggleSidebar: () => void;
    activeRouteId: string | null;
    setActiveRouteId: (id: string | null) => void;
    codeLookup: Map<string, JeepneyCodeEntry>;
    getRouteColor: (routeId: string, fallbackStroke?: string) => string;
    searchQuery: string;
}

export default function DesktopJeepneySidebar({
    sidebarPhase,
    isClosing,
    toggleSidebar,
    activeRouteId,
    setActiveRouteId,
    codeLookup,
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

    // --- NEW: Filter Logic ---
    const filteredRoutes = jeepneyRoutesData.features.filter((feature) => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        const codeEntry = codeLookup.get(feature.properties.routeId.toLowerCase());
        const displayId = codeEntry?.routeId || feature.properties.routeId;
        const displayCode = codeEntry?.routeCode || feature.properties.routeId;
        const name = feature.properties.name || '';

        return (
            name.toLowerCase().includes(searchLower) ||
            displayId.toLowerCase().includes(searchLower) ||
            displayCode.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div
            style={sidebarStyle}
            className={`max-md:hidden absolute top-4 left-4 z-[1000] pointer-events-auto bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden
            ${sidebarPhase === 'open'
                    ? 'w-80 h-[calc(100dvh-5.75rem)] rounded-2xl'
                    : sidebarPhase === 'peek'
                        ? 'w-80 h-[77px] rounded-2xl'
                        : 'w-48 h-[56px] rounded-2xl cursor-pointer hover:bg-slate-50'
                }`}
        >
            {/* Sidebar Header / Collapsed Button */}
            <div
                onClick={() => sidebarPhase === 'closed' && toggleSidebar()}
                className={`flex items-center justify-between shrink-0 transition-colors duration-300 ${isExpanded ? 'p-4 border-b border-slate-100 bg-slate-50' : 'w-full h-full px-4 justify-start'}`}
            >
                <div className={`flex items-center gap-3 ${!isExpanded && 'w-full justify-start'}`}>
                    {!isExpanded && <MapIcon className="w-5 h-5 text-blue-600 shrink-0" />}

                    <div className="whitespace-nowrap block">
                        <h2 className={`font-bold text-slate-900 transition-all duration-300 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                            Jeepney Routes
                        </h2>
                        <div className={`text-xs text-slate-500 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-10 opacity-100 mt-0.5' : 'max-h-0 opacity-0'}`}>
                            Select a route to check the fare
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors shrink-0"
                        title="Close Sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Sidebar Body */}
            {/* The delay-150 ensures the text waits until the roll-down is halfway finished before fading in */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out ${isFullyOpen ? 'opacity-100 visible delay-150' : 'opacity-0 invisible delay-0'}`}>
                {filteredRoutes.length > 0 ? (
                    <ul className="p-3 space-y-2">
                        {filteredRoutes.map((feature) => {
                            const isActive = activeRouteId === feature.properties.routeId;
                            const codeEntry = codeLookup.get(feature.properties.routeId.toLowerCase());
                            const routeColor = getRouteColor(feature.properties.routeId, feature.properties.stroke);
                            const displayId = codeEntry?.routeId || feature.properties.routeId;
                            const displayCode = codeEntry?.routeCode || feature.properties.routeId;
                            const fare = codeEntry?.routeFare;

                            return (
                                <li key={feature.properties.routeId}>
                                    <button
                                        onClick={() => {
                                            setActiveRouteId(isActive ? null : feature.properties.routeId);
                                        }}
                                        style={{ borderLeftColor: routeColor, borderLeftWidth: 4 }}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${isActive
                                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm px-1 text-center leading-none"
                                                style={{ backgroundColor: routeColor }}
                                            >
                                                {displayCode}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 leading-tight truncate">{feature.properties.name}</div>
                                                <div
                                                    className="text-[10px] font-bold tracking-wider uppercase mt-0.5"
                                                    style={{ color: routeColor }}
                                                >
                                                    Route {displayId}
                                                </div>
                                            </div>
                                        </div>

                                        {isActive && (
                                            fare ? (
                                                <div className="mt-3 pt-3 border-t border-blue-100 grid grid-cols-2 gap-2">
                                                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-2">
                                                        <div className="flex items-center gap-1.5 text-emerald-700">
                                                            <Banknote className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="text-[9px] font-bold uppercase tracking-wide">Regular</span>
                                                        </div>
                                                        <div className="text-base font-extrabold text-slate-900 mt-0.5">
                                                            ₱{fare.regular}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-2">
                                                        <div className="flex items-center gap-1.5 text-indigo-700">
                                                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="text-[9px] font-bold uppercase tracking-wide">Student / PWD</span>
                                                        </div>
                                                        <div className="text-base font-extrabold text-slate-900 mt-0.5">
                                                            ₱{fare.discounted}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2">
                                                    <Banknote className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span className="text-sm font-semibold text-slate-500">Fare not yet available</span>
                                                </div>
                                            )
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No routes found matching <span className="font-bold text-slate-700">"{searchQuery}"</span>
                    </div>
                )}
            </div>
        </div>
    );
}
