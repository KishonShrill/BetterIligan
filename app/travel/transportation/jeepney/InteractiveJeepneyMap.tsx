"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MapGL, { Source, Layer } from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import bbox from "@turf/bbox";
import type { GeoJsonObject } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker?worker&url";

setWorkerUrl(workerUrl);

import { Search, X } from "lucide-react";
import { ROUTE_DIRECTORY_CODES } from "@/utils/variables";
import type { JeepneyRoute, JeepneyCodeEntry } from "./types";

import JeepneyMapControls from "./JeepneyMapControls";
import DesktopJeepneySidebar from "./DesktopJeepneySidebar";
import JeepneyRouteDetails from "./JeepneyRouteDetails";
import MobileJeepneyHeader from "./MobileJeepneyHeader";
import MobileJeepneyRouteSelector from "./MobileJeepneyRouteSelector";

const jeepneyRoutesData = await fetch("/data/travel/jeepney-routes.json").then(
  (res) => res.json(),
);
const jeepneyCodesData = await fetch("/data/travel/jeepneyCoding.json").then(
  (res) => res.json(),
);
const iliganBoundaryData = await fetch(
  "/data/travel/iligan-city-boundary.json",
).then((res) => res.json());

const geoJsonData = jeepneyRoutesData as GeoJsonObject;
const boundaryGeoJsonData = iliganBoundaryData as GeoJsonObject;

function FitToRoute({
  activeRouteId,
  mapRef,
}: {
  activeRouteId: string | null;
  mapRef: React.RefObject<MapRef | null>;
}) {
  useEffect(() => {
    if (!activeRouteId || !mapRef.current) return;

    const selectedFeature = jeepneyRoutesData.features.find(
      (f) => f.properties.routeId === activeRouteId,
    );

    if (!selectedFeature) return;

    const bounds = bbox(selectedFeature);

    mapRef.current.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        padding: 40,
        duration: 500,
      },
    );
  }, [activeRouteId, mapRef]);

  return null;
}

export default function InteractiveJeepneyMap() {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef<MapRef>(null);

  // --- NEW: 3-Phase Animation State ---
  const [sidebarPhase, setSidebarPhase] = useState<"closed" | "peek" | "open">(
    "open",
  );
  const [isClosing, setIsClosing] = useState(false);

  const codeLookup = useMemo(() => {
    const lookup = new Map<string, JeepneyCodeEntry>();

    (jeepneyCodesData as JeepneyCodeEntry[]).forEach((entry) => {
      lookup.set(entry.routeId.toLowerCase(), entry);
    });

    return lookup;
  }, []);

  const getRouteColor = (routeId: string, fallbackStroke?: string) => {
    const entry = codeLookup.get(routeId.toLowerCase());
    return entry?.routeColor || fallbackStroke || "#3B82F6";
  };

  const routeColorExpression = useMemo(() => {
    const expression: any[] = ["match", ["get", "routeId"]];

    jeepneyRoutesData.features.forEach((feature) => {
      const routeId = feature.properties.routeId;
      const color = getRouteColor(routeId, feature.properties.stroke);

      expression.push(routeId, color);
    });

    expression.push("#3B82F6");

    return expression;
  }, [codeLookup]);

  const selectedRoute = useMemo(() => {
    if (!activeRouteId) return null;

    const feature = jeepneyRoutesData.features.find(
      (feature) => feature.properties.routeId === activeRouteId,
    );

    const codeEntry = codeLookup.get(activeRouteId.toLowerCase());

    if (feature) {
      return {
        routeId: feature.properties.routeId,
        name: feature.properties.name ?? `Route ${feature.properties.routeId}`,
        routeColor: codeEntry?.routeColor ?? feature.properties.stroke,
        routeFare: codeEntry?.routeFare,
        hasGeoJson: true,
        codeEntry,
      };
    }

    /*
     * Route exists in the directory/code data,
     * but does not have GeoJSON yet.
     */
    if (codeEntry) {
      return {
        routeId: codeEntry.routeId,
        name: `Route ${codeEntry.routeId}`,
        routeColor: codeEntry.routeColor,
        routeFare: codeEntry.routeFare,
        hasGeoJson: false,
        codeEntry,
      };
    }

    return null;
  }, [activeRouteId, codeLookup]);
  const isDetailsOpen = selectedRoute !== null;

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const features = event.target.queryRenderedFeatures(event.point, {
      layers: ["jeepney-route-hitbox"],
    });

    if (!features.length) return;

    const routeId = features[0].properties?.routeId;

    if (typeof routeId !== "string") return;

    setActiveRouteId(routeId);
    setShowAllRoutes(false);
  };

  const toggleSidebar = () => {
    if (sidebarPhase === "closed") {
      setIsClosing(false);
      setSidebarPhase("peek");
      setTimeout(() => setSidebarPhase("open"), 250);
    } else if (sidebarPhase === "open") {
      setIsClosing(true);
      setSidebarPhase("peek");
      setTimeout(() => setSidebarPhase("closed"), 350);
    }
  };

  // --- NEW: Dynamic Style for the Search Bar ---
  // Mirrors the exact timing of the sidebar's width transition
  const searchStyle = {
    transitionProperty: "transform",
    transitionDuration:
      (sidebarPhase === "peek" && !isClosing) ||
      (sidebarPhase === "closed" && isClosing)
        ? "250ms"
        : "350ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    // 12rem = w-48 (closed), 20rem = w-80 (open), plus 1rem gap
    transform:
      sidebarPhase === "closed"
        ? "translateX(calc(12rem + 1rem))"
        : "translateX(calc(20rem + 1rem))",
  };

  const phaseRef = useRef(sidebarPhase);
  useEffect(() => {
    phaseRef.current = sidebarPhase;
  }, [sidebarPhase]);

  useEffect(() => {
    if (activeRouteId !== null) setShowAllRoutes(false);
    else setShowAllRoutes(true);
    if (activeRouteId && phaseRef.current === "closed") {
      setIsClosing(false);
      setSidebarPhase("peek");
      setTimeout(() => setSidebarPhase("open"), 250);
    }
  }, [activeRouteId]);

  const allRoutes = useMemo(() => {
    const routeMap = new Map<string, JeepneyRoute>();

    for (const routeCode of ROUTE_DIRECTORY_CODES) {
      const key = routeCode.toLowerCase();
      const codeEntry = codeLookup.get(key);

      routeMap.set(key, {
        routeId: codeEntry?.routeId ?? routeCode,
        name: `Route ${routeCode}`,
        routeColor: codeEntry?.routeColor,
        routeFare: codeEntry?.routeFare,
        hasGeoJson: false,
      });
    }

    for (const feature of jeepneyRoutesData.features) {
      const routeId = feature.properties.routeId;
      const key = routeId.toLowerCase();

      const existing = routeMap.get(key);
      const codeEntry = codeLookup.get(key);

      routeMap.set(key, {
        routeId: existing?.routeId ?? codeEntry?.routeId ?? routeId,
        name: feature.properties.name || existing?.name || `Route ${routeId}`,
        routeColor:
          existing?.routeColor ??
          codeEntry?.routeColor ??
          feature.properties.stroke,
        routeFare: existing?.routeFare ?? codeEntry?.routeFare,
        hasGeoJson: true,
      });
    }

    for (const codeEntry of codeLookup.values()) {
      const key = codeEntry.routeId.toLowerCase();

      if (!routeMap.has(key)) {
        routeMap.set(key, {
          routeId: codeEntry.routeId,
          name: `Route ${codeEntry.routeId}`,
          routeColor: codeEntry.routeColor,
          routeFare: codeEntry.routeFare,
          hasGeoJson: false,
        });
      }
    }

    return Array.from(routeMap.values());
  }, [codeLookup]);

  const sortedRoutes = useMemo(() => {
    return [...allRoutes].sort((a, b) => {
      // Available routes first
      if (a.hasGeoJson !== b.hasGeoJson) {
        return a.hasGeoJson ? -1 : 1;
      }

      // Then sort by route code
      return a.routeId.localeCompare(b.routeId, undefined, {
        numeric: true,
      });
    });
  }, [allRoutes]);

  const filteredRoutes = useMemo(() => {
    if (!searchQuery) {
      return sortedRoutes;
    }

    const searchLower = searchQuery.toLowerCase();

    return sortedRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchLower) ||
        route.routeId.toLowerCase().includes(searchLower),
    );
  }, [sortedRoutes, searchQuery]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50">
      {/* --- MAP LAYER (Background) --- */}
      <MapGL
        ref={mapRef}
        initialViewState={{
          longitude: 124.2452,
          latitude: 8.228,
          zoom: 16,
          pitch: 60,
          bearing: -20,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={handleMapClick}
        interactiveLayerIds={["jeepney-route-hitbox"]}
      >
        <JeepneyMapControls mapRef={mapRef} />
        <FitToRoute activeRouteId={activeRouteId} mapRef={mapRef} />

        <Source id="iligan-boundary" type="geojson" data={boundaryGeoJsonData}>
          <Layer
            id="iligan-boundary-line"
            type="line"
            paint={{
              "line-color": "#94a3b8",
              "line-width": 2,
              "line-dasharray": [4, 4],
            }}
          />

          <Layer
            id="iligan-boundary-fill"
            type="fill"
            paint={{
              "fill-color": "#cbd5e1",
              "fill-opacity": 0.05,
            }}
          />
        </Source>

        {/*
                    <Layer
                        id="3d-buildings"
                        type="fill-extrusion"
                        source="buildings"
                        source-layer="building"
                        minzoom={15}
                        paint={{
                            'fill-extrusion-height': ['get', 'height'],
                            'fill-extrusion-base': ['get', 'min_height'],
                            'fill-extrusion-opacity': 0.8,
                        }}
                    />
                    */}

        <Source id="jeepney-routes" type="geojson" data={geoJsonData}>
          {/* Mobile-friendly invisible hitbox */}
          <Layer
            id="jeepney-route-hitbox"
            type="line"
            paint={{
              "line-color": "#000000",
              "line-width": 24,
              "line-opacity": 0,
            }}
          />

          {/* Visible routes */}
          <Layer
            id="jeepney-routes"
            type="line"
            paint={{
              "line-color": routeColorExpression,
              "line-width": [
                "case",
                ["==", ["get", "routeId"], activeRouteId ?? ""],
                6,
                3,
              ],
              "line-opacity": [
                "case",
                ["==", ["get", "routeId"], activeRouteId ?? ""],
                1,
                showAllRoutes ? 0.6 : 0,
              ],
            }}
          />
        </Source>
      </MapGL>

      {/* MOBILE */}
      <MobileJeepneyHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredRoutes={filteredRoutes}
        setActiveRouteId={setActiveRouteId}
      />

      <MobileJeepneyRouteSelector
        routes={filteredRoutes}
        activeRouteId={activeRouteId}
        setActiveRouteId={setActiveRouteId}
        showAllRoutes={showAllRoutes}
        setShowAllRoutes={setShowAllRoutes}
        getRouteColor={getRouteColor}
      />

      {/* DESKTOP */}
      {/* --- FLOATING LEFT SIDEBAR --- */}
      <DesktopJeepneySidebar
        sidebarPhase={sidebarPhase}
        isClosing={isClosing}
        toggleSidebar={toggleSidebar}
        routes={filteredRoutes}
        activeRouteId={activeRouteId}
        setActiveRouteId={setActiveRouteId}
        getRouteColor={getRouteColor}
        searchQuery={searchQuery}
      />
      <div
        className="pointer-events-auto absolute top-4 left-4 z-[999] flex h-[56px] w-64 items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-xl max-md:hidden"
        style={searchStyle}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder="Search routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // Opens the sidebar automatically if they type while it's closed
          onFocus={() => sidebarPhase === "closed" && toggleSidebar()}
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* --- FLOATING RIGHT SIDEBAR --- */}
      <JeepneyRouteDetails
        route={selectedRoute}
        codeEntry={selectedRoute?.codeEntry}
        getRouteColor={getRouteColor}
        onClose={() => setActiveRouteId(null)}
      />
      <div
        className="pointer-events-auto absolute top-4 right-4 z-1000 rounded-2xl bg-slate-50 p-2 shadow-xl transition-transform duration-300 ease-in-out max-md:hidden"
        style={{
          transform: isDetailsOpen
            ? "translateX(calc(-20rem - 1rem))"
            : "translateX(0)",
        }}
      >
        <Link
          href="/"
          aria-label="BetterIligan home"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logos/betteriligan-logo.png"
            alt="BetterIligan"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />
          <span className="hidden text-sm font-extrabold tracking-tight text-slate-900 sm:inline">
            BetterIligan
          </span>
        </Link>
      </div>
    </div>
  );
}
