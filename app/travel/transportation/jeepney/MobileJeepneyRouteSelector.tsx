'use client'

import { Eye, EyeOff } from 'lucide-react';

type JeepneyRoute = {
    routeId: string;
    name: string;
    routeColor?: string;
    hasGeoJson: boolean;
};

interface MobileJeepneyRouteSelectorProps {
    routes: JeepneyRoute[];
    activeRouteId: string | null;
    setActiveRouteId: (id: string | null) => void;
    showAllRoutes: boolean;
    setShowAllRoutes: (show: boolean) => void;
    getRouteColor: (
        routeId: string,
        fallbackStroke?: string
    ) => string;
}

export default function MobileJeepneyRouteSelector({
    routes,
    activeRouteId,
    setActiveRouteId,
    showAllRoutes,
    setShowAllRoutes,
    getRouteColor,
}: MobileJeepneyRouteSelectorProps) {
    return (
        <div className="md:hidden absolute bottom-3 left-3 right-17 z-1000 pointer-events-none">
            <div className="flex flex-col gap-2">

                {/* Show All Routes */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            const nextValue = !showAllRoutes;

                            setShowAllRoutes(nextValue);

                            if (nextValue) {
                                setActiveRouteId(null);
                            }
                        }}
                        className={`
                            pointer-events-auto
                            flex items-center gap-2
                            px-3 py-2
                            rounded-xl
                            shadow-lg
                            border
                            text-xs
                            font-bold
                            transition-all
                            ${showAllRoutes
                                ? 'bg-slate-800 text-white border-slate-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        {showAllRoutes ? (
                            <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                            <Eye className="w-3.5 h-3.5" />
                        )}

                        {showAllRoutes
                            ? 'Hide All'
                            : 'Show All'}
                    </button>
                </div>

                {/* Route Selector */}
                <div
                    className="
                        pointer-events-auto
                        w-full
                        rounded-2xl
                        bg-white
                        border
                        border-slate-200
                        shadow-2xl
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            flex
                            gap-2
                            overflow-x-auto
                            p-2
                            custom-scrollbar
                            overscroll-x-contain
                        "
                    >
                        {routes.map((route) => {
                            const isActive =
                                activeRouteId === route.routeId;

                            const routeColor = getRouteColor(
                                route.routeId,
                                route.routeColor
                            );

                            return (
                                <button
                                    key={route.routeId}
                                    type="button"
                                    onClick={() => {
                                        setActiveRouteId(
                                            isActive
                                                ? null
                                                : route.routeId
                                        );
                                    }}
                                    className={`
                                        relative
                                        shrink-0
                                        min-w-[52px]
                                        h-12
                                        px-3
                                        rounded-xl
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-0.5
                                        border
                                        transition-all
                                        ${isActive
                                            ? 'shadow-sm scale-[1.02]'
                                            : 'bg-white border-slate-100 hover:bg-slate-50'
                                        }
                                        ${!route.hasGeoJson
                                            ? 'opacity-60'
                                            : ''
                                        }
                                    `}
                                    style={
                                        isActive
                                            ? {
                                                backgroundColor: `${routeColor}15`,
                                                borderColor: routeColor,
                                            }
                                            : undefined
                                    }
                                    aria-label={`Select route ${route.routeId}`}
                                    aria-pressed={isActive}
                                >
                                    {/* Route code */}
                                    <span
                                        className="text-xs font-extrabold leading-none"
                                        style={{
                                            color: routeColor,
                                        }}
                                    >
                                        {route.routeId}
                                    </span>

                                    {/* Availability */}
                                    <span
                                        className={`
                                            w-1.5
                                            h-1.5
                                            rounded-full
                                            ${route.hasGeoJson
                                                ? 'bg-emerald-500'
                                                : 'bg-amber-400'
                                            }
                                        `}
                                        title={
                                            route.hasGeoJson
                                                ? 'Map available'
                                                : 'Map unavailable'
                                        }
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
