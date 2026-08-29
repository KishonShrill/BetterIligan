"use client";

import { Map as MapIcon, X } from "lucide-react";
import type { JeepneyRoute } from "./types";

interface DesktopJeepneySidebarProps {
  sidebarPhase: "closed" | "peek" | "open";
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
  searchQuery,
}: DesktopJeepneySidebarProps) {
  // Dynamically adjust the transition speed based on the current animation phase
  const sidebarStyle = {
    transitionProperty: "width, height, border-radius",
    transitionDuration:
      (sidebarPhase === "peek" && !isClosing) ||
      (sidebarPhase === "closed" && isClosing)
        ? "250ms" // Faster for horizontal expansions/shrinks
        : "350ms", // Slower, smoother drop for vertical roll-ups/downs
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Helper booleans for clean rendering
  const isExpanded = sidebarPhase !== "closed";
  const isFullyOpen = sidebarPhase === "open";

  return (
    <div
      style={sidebarStyle}
      className={`pointer-events-auto absolute top-4 left-4 z-[1000] flex flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl max-md:hidden ${
        sidebarPhase === "open"
          ? "h-[calc(100dvh-2rem)] w-80 rounded-2xl"
          : sidebarPhase === "peek"
            ? "h-[77px] w-80 rounded-2xl"
            : "h-[56px] w-48 cursor-pointer rounded-2xl hover:bg-slate-50"
      }`}
    >
      {/* Sidebar Header / Collapsed Button */}
      <div
        onClick={() => sidebarPhase === "closed" && toggleSidebar()}
        className={`flex shrink-0 items-center justify-between transition-colors duration-300 ${
          isExpanded
            ? "border-b border-slate-100 bg-slate-50 p-4"
            : "h-full w-full justify-start px-4"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            !isExpanded && "w-full justify-start"
          }`}
        >
          {!isExpanded && (
            <MapIcon className="h-5 w-5 shrink-0 text-blue-600" />
          )}

          <div className="block whitespace-nowrap">
            <h2
              className={`font-bold text-slate-900 transition-all duration-300 ${
                isExpanded ? "text-lg" : "text-sm"
              }`}
            >
              Jeepney Routes
            </h2>

            <div
              className={`overflow-hidden text-xs text-slate-500 transition-all duration-300 ${
                isExpanded ? "mt-0.5 max-h-10 opacity-100" : "max-h-0 opacity-0"
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
            className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
            title="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sidebar Body */}
      <div
        className={`custom-scrollbar flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isFullyOpen
            ? "visible opacity-100 delay-150"
            : "invisible opacity-0 delay-0"
        }`}
      >
        {routes.length > 0 ? (
          <ul className="space-y-2 p-3">
            {routes.map((route) => {
              const isActive = activeRouteId === route.routeId;

              /*
               * Use the route's configured color if available.
               * For missing GeoJSON routes, getRouteColor can still
               * provide a fallback based on the route ID.
               */
              const routeColor = getRouteColor(route.routeId, route.routeColor);

              return (
                <li key={route.routeId}>
                  <button
                    onClick={() => {
                      setActiveRouteId(isActive ? null : route.routeId);
                    }}
                    style={{
                      borderLeftColor: routeColor,
                      borderLeftWidth: 4,
                    }}
                    className={`w-full cursor-pointer rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Route Code */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg px-1 text-center text-[10px] leading-none font-bold text-white shadow-sm ${
                          !route.hasGeoJson ? "opacity-50" : ""
                        }`}
                        style={{
                          backgroundColor: routeColor,
                        }}
                      >
                        {route.routeId}
                      </div>

                      {/* Route Information */}
                      <div className="min-w-0">
                        <div className="truncate leading-tight font-bold text-slate-900">
                          {route.name}
                        </div>

                        <div
                          className="mt-0.5 text-[10px] font-bold tracking-wider uppercase"
                          style={{
                            color: routeColor,
                          }}
                        >
                          Route {route.routeId}
                        </div>
                      </div>
                    </div>

                    {/* Missing GeoJSON */}
                    {!route.hasGeoJson && (
                      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />

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
            No routes found matching{" "}
            <span className="font-bold text-slate-700">
              &ldquo;{searchQuery}&rdquo;
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
