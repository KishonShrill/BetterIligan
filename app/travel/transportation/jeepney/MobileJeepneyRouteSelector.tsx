"use client";

import { Eye, EyeOff } from "lucide-react";

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
  getRouteColor: (routeId: string, fallbackStroke?: string) => string;
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
    <div className="pointer-events-none absolute right-17 bottom-3 left-3 z-1000 md:hidden">
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
            className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold shadow-lg transition-all ${
              showAllRoutes
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            } `}
          >
            {showAllRoutes ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}

            {showAllRoutes ? "Hide All" : "Show All"}
          </button>
        </div>

        {/* Route Selector */}
        <div className="pointer-events-auto w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="custom-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain p-2">
            {routes.map((route) => {
              const isActive = activeRouteId === route.routeId;

              const routeColor = getRouteColor(route.routeId, route.routeColor);

              return (
                <button
                  key={route.routeId}
                  type="button"
                  onClick={() => {
                    setActiveRouteId(isActive ? null : route.routeId);
                  }}
                  className={`relative flex h-12 min-w-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-3 transition-all ${
                    isActive
                      ? "scale-[1.02] shadow-sm"
                      : "border-slate-100 bg-white hover:bg-slate-50"
                  } ${!route.hasGeoJson ? "opacity-60" : ""} `}
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
                    className="text-xs leading-none font-extrabold"
                    style={{
                      color: routeColor,
                    }}
                  >
                    {route.routeId}
                  </span>

                  {/* Availability */}
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      route.hasGeoJson ? "bg-emerald-500" : "bg-amber-400"
                    } `}
                    title={
                      route.hasGeoJson ? "Map available" : "Map unavailable"
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
