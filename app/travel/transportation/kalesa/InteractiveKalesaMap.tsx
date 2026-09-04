"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MapGL, { Source, Layer } from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import bbox from "@turf/bbox";
import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker?worker&url";

setWorkerUrl(workerUrl);

import { Compass } from "lucide-react";
import type { KalesaRoute, KalesaCodeEntry } from "./type";

import MapLibreControls from "@/components/ui/MapLibreControls";
import DesktopRouteSidebar from "@/components/ui/DesktopRouteSidebar";
import RouteDetails from "@/components/ui/RouteDetails";
import MobileRouteHeader from "@/components/ui/MobileRouteHeader";
import MobileRouteSelector from "@/components/ui/MobileRouteSelector";

function FitToRoute({
  activeRouteId,
  mapRef,
  routesData,
}: {
  activeRouteId: string | null;
  mapRef: React.RefObject<MapRef | null>;
  routesData: any;
}) {
  useEffect(() => {
    if (!activeRouteId || !mapRef.current || !routesData) return;

    // Look for LineString feature matching active route
    const selectedFeature = routesData.features.find(
      (f: any) =>
        f.properties.routeId === activeRouteId &&
        f.geometry.type === "LineString",
    );

    if (!selectedFeature) return;

    const [minX, minY, maxX, maxY] = bbox(selectedFeature);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Pan to target route center without zooming in/out
    mapRef.current.easeTo({
      center: [centerX, centerY],
      duration: 500,
    });
  }, [activeRouteId, mapRef, routesData]);

  return null;
}

export default function InteractiveKalesaMap() {
  const [routesData, setRoutesData] = useState<any>(null);
  const [codesData, setCodesData] = useState<any>(null);
  const [isTerrainEnabled, setIsTerrainEnabled] = useState(false);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef<MapRef>(null);

  const [sidebarPhase, setSidebarPhase] = useState<"closed" | "peek" | "open">(
    "open",
  );
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [routesRes, codesRes, boundaryRes] = await Promise.all([
          fetch("/data/travel/kalesa-routes.json").then((res) => res.json()),
          fetch("/data/travel/kalesa-fare.json").then((res) => res.json()),
          fetch("/data/travel/iligan-city-boundary.json").then((res) =>
            res.json(),
          ),
        ]);
        setRoutesData(routesRes);
        setCodesData(codesRes);
        setBoundaryData(boundaryRes);
      } catch (error) {
        console.error("Failed to load kalesa geospatial data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const codeLookup = useMemo(() => {
    const lookup = new Map<string, KalesaCodeEntry>();
    if (!codesData) return lookup;

    const entries = Array.isArray(codesData)
      ? codesData
      : codesData.entries || codesData.data || Object.values(codesData);

    if (Array.isArray(entries)) {
      (entries as KalesaCodeEntry[]).forEach((entry) => {
        if (entry && entry.routeId) {
          lookup.set(entry.routeId.toLowerCase(), entry);
        }
      });
    }

    return lookup;
  }, [codesData]);

  const getRouteColor = (routeId: string, fallbackStroke?: string) => {
    const entry = codeLookup.get(routeId.toLowerCase());
    return entry?.routeColor || fallbackStroke || "#033399";
  };

  const routeColorExpression = useMemo(() => {
    return ["coalesce", ["get", "routeColor"], ["get", "stroke"], "#033399"];
  }, []);

  const selectedRoute = useMemo(() => {
    if (!activeRouteId || !routesData) return null;

    const feature = routesData.features.find(
      (feature: any) =>
        feature.properties.routeId === activeRouteId &&
        feature.geometry.type === "LineString",
    );
    const codeEntry = codeLookup.get(activeRouteId.toLowerCase());

    if (feature) {
      return {
        routeId: feature.properties.routeId,
        name: feature.properties.name ?? `${feature.properties.routeId}`,
        routeColor:
          feature.properties.routeColor ??
          feature.properties.stroke ??
          codeEntry?.routeColor,
        routeFare: feature.properties.routeFare ?? codeEntry?.routeFare,
        hasGeoJson: true,
        codeEntry,
      };
    }

    if (codeEntry) {
      return {
        routeId: codeEntry.routeId,
        name: `${codeEntry.routeId}`,
        routeColor: codeEntry.routeColor,
        routeFare: codeEntry.routeFare,
        hasGeoJson: false,
        codeEntry,
      };
    }

    return null;
  }, [activeRouteId, codeLookup, routesData]);

  const isDetailsOpen = selectedRoute !== null;

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const features = mapInstance.queryRenderedFeatures(event.point, {
      layers: ["kalesa-route-hitbox"],
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

  const phaseRef = useRef(sidebarPhase);
  useEffect(() => {
    phaseRef.current = sidebarPhase;
  }, [sidebarPhase]);

  useEffect(() => {
    if (activeRouteId !== null) {
      setShowAllRoutes(false);
      if (phaseRef.current !== "open") {
        setIsClosing(false);
        setSidebarPhase("peek");
        setTimeout(() => setSidebarPhase("open"), 250);
      }
    } else {
      setShowAllRoutes(true);
    }
  }, [activeRouteId]);

  const allRoutes = useMemo(() => {
    const routeMap = new Map<string, KalesaRoute>();
    if (!routesData) return [];

    for (const feature of routesData.features) {
      // Exclude Point features (terminals) from selectable sidebar routes
      if (feature.geometry.type !== "LineString") continue;

      const routeId = feature.properties.routeId;
      const key = routeId.toLowerCase();

      const existing = routeMap.get(key);
      const codeEntry = codeLookup.get(key);

      const rawName = feature.properties.name?.trim();
      const validName = rawName
        ? rawName.toLowerCase().startsWith("kalesa route")
          ? rawName
          : ` ${rawName}`
        : null;

      routeMap.set(key, {
        routeId: existing?.routeId ?? codeEntry?.routeId ?? routeId,
        name: validName || existing?.name || ` ${routeId}`,
        routeColor:
          feature.properties.routeColor ??
          feature.properties.stroke ??
          existing?.routeColor ??
          codeEntry?.routeColor,
        routeFare: feature.properties.routeFare ?? codeEntry?.routeFare,
        hasGeoJson: true,
      });
    }

    for (const codeEntry of codeLookup.values()) {
      const key = codeEntry.routeId.toLowerCase();

      if (!routeMap.has(key)) {
        routeMap.set(key, {
          routeId: codeEntry.routeId,
          name: `${codeEntry.routeId}`,
          routeColor: codeEntry.routeColor,
          routeFare: codeEntry.routeFare,
          hasGeoJson: false,
        });
      }
    }

    return Array.from(routeMap.values());
  }, [codeLookup, routesData]);

  const sortedRoutes = useMemo(() => {
    return [...allRoutes].sort((a, b) => {
      if (a.hasGeoJson !== b.hasGeoJson) {
        return a.hasGeoJson ? -1 : 1;
      }
      return a.routeId.localeCompare(b.routeId, undefined, { numeric: true });
    });
  }, [allRoutes]);

  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return sortedRoutes;
    const searchLower = searchQuery.toLowerCase();
    return sortedRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchLower) ||
        route.routeId.toLowerCase().includes(searchLower),
    );
  }, [sortedRoutes, searchQuery]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 text-slate-600">
        <Compass className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50">
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
        interactiveLayerIds={["kalesa-route-hitbox"]}
      >
        <MapLibreControls
          mapRef={mapRef}
          isTerrainEnabled={isTerrainEnabled}
          onToggleTerrain={() => setIsTerrainEnabled(!isTerrainEnabled)}
        />
        <FitToRoute
          activeRouteId={activeRouteId}
          mapRef={mapRef}
          routesData={routesData}
        />

        {boundaryData && (
          <Source id="iligan-boundary" type="geojson" data={boundaryData}>
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
        )}

        {routesData && (
          <Source id="kalesa-routes" type="geojson" data={routesData}>
            {/* Route Line Layers */}
            <Layer
              id="kalesa-route-hitbox"
              type="line"
              filter={["==", "$type", "LineString"]}
              paint={{
                "line-color": "#000000",
                "line-width": 24,
                "line-opacity": 0,
              }}
            />
            <Layer
              id="kalesa-routes-layer"
              type="line"
              filter={["==", "$type", "LineString"]}
              paint={{
                "line-color": routeColorExpression as any,
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

            {/* Terminal Point Layers (from Point features in GeoJSON) */}
            <Layer
              id="terminal-pin-outer"
              type="circle"
              filter={["==", "$type", "Point"]}
              paint={{
                "circle-radius": 10,
                "circle-color": "#d97706",
                "circle-stroke-width": 3,
                "circle-stroke-color": "#ffffff",
              }}
            />
            <Layer
              id="terminal-pin-inner"
              type="circle"
              filter={["==", "$type", "Point"]}
              paint={{
                "circle-radius": 4,
                "circle-color": "#ffffff",
              }}
            />
            <Layer
              id="terminal-label"
              type="symbol"
              filter={["==", "$type", "Point"]}
              layout={{
                "text-field": ["get", "name"],
                "text-size": 12,
                "text-offset": [0, 1.5],
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#1e293b",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              }}
            />
          </Source>
        )}
      </MapGL>

      <MobileRouteHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredRoutes={filteredRoutes}
        setActiveRouteId={setActiveRouteId}
        vehicleType="kalesa"
      />

      <MobileRouteSelector
        routes={filteredRoutes}
        activeRouteId={activeRouteId}
        setActiveRouteId={setActiveRouteId}
        showAllRoutes={showAllRoutes}
        setShowAllRoutes={setShowAllRoutes}
        getRouteColor={getRouteColor}
      />

      <DesktopRouteSidebar
        title="Kalesa Routes"
        subtitle="Select a route to check details"
        sidebarPhase={sidebarPhase}
        isClosing={isClosing}
        toggleSidebar={toggleSidebar}
        routes={filteredRoutes}
        activeRouteId={activeRouteId}
        setActiveRouteId={setActiveRouteId}
        getRouteColor={getRouteColor}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <RouteDetails
        route={selectedRoute}
        codeEntry={selectedRoute?.codeEntry}
        getRouteColor={getRouteColor}
        onClose={() => setActiveRouteId(null)}
      />

      <div
        className="pointer-events-auto absolute top-4 right-4 z-[1000] rounded-2xl bg-slate-50 p-2 shadow-xl transition-transform duration-300 ease-in-out max-md:hidden"
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
