"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Map, {
  Layer,
  MapRef,
  Source,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ILIGAN_CENTER,
  routesGeoJSON,
  mugnaZoneGeoJSON,
  interiorDetailsGeoJSON,
} from "./variables";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker?worker&url";
import bbox from "@turf/bbox";

setWorkerUrl(workerUrl);

const ROUTE_GROUPS = {
  green: ["green-entrance", "green-entrance-2"],
  orange: ["orange-exit", "orange-exit-backwards"],
  blue: ["new-frontier-homeowners", "new-frontier-homeowners-2"],
  red: ["red-exit"],
} as const;

export default function MugnaMap() {
  const mapRef = useRef<MapRef | null>(null);
  const [showInterior, setShowInterior] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: ILIGAN_CENTER[0],
    latitude: ILIGAN_CENTER[1],
    zoom: 15.5,
    pitch: 0,
    bearing: 0,
  });

  const handleMapClick = useCallback(
    (event: any) => {
      const features = event.features;

      // Clicking the MUGNA polygon
      if (
        features?.some((feature: any) => feature.layer?.id === "mugna-fill")
      ) {
        setSelectedRoute(null);
        setShowInterior(true);

        mapRef.current?.flyTo({
          center: [124.25, 8.24928],
          zoom: 18.5,
          pitch: 45,
          bearing: 0,
          duration: 1200,
        });

        return;
      }

      // Clicking anywhere else restores all routes
      setSelectedRoute(null);

      if (showInterior) {
        setShowInterior(false);

        mapRef.current?.flyTo({
          center: ILIGAN_CENTER,
          zoom: 15.5,
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
      }
    },
    [showInterior],
  );

  const selectRoute = useCallback((route: keyof typeof ROUTE_GROUPS) => {
    setSelectedRoute(route);

    const routeIds = ROUTE_GROUPS[route];

    const selectedFeatures = routesGeoJSON.features.filter((feature) =>
      routeIds.includes(feature.properties.id as never),
    );

    if (selectedFeatures.length === 0) return;

    const featureCollection = {
      type: "FeatureCollection" as const,
      features: selectedFeatures,
    };

    const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);

    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 100,
        duration: 1000,
        maxZoom: 17,
      },
    );
  }, []);

  const handleMove = useCallback((event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  }, []);

  const handleBack = useCallback(() => {
    setShowInterior(false);

    mapRef.current?.flyTo({
      center: ILIGAN_CENTER,
      zoom: 15.5,
      pitch: 0,
      bearing: 0,
      duration: 1000,
    });
  }, []);

  return (
    <div className="relative h-[calc(100dvh-104px-32px)] w-full overflow-hidden sm:h-[calc(100dvh-80px-32px)]">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute top-0 right-0 left-0 z-10 p-4">
        <div
          className={cn(
            "mx-auto rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur",
            showInterior ? "w-fit" : "max-w-3xl",
          )}
        >
          {!showInterior && (
            <>
              <h1 className="text-xl font-bold text-gray-900">
                MUGNA SA ILIGAN 2026
              </h1>

              <p className="text-sm text-gray-600">
                Traffic Routes ug Parking Restrictions (Sugod Setyembre 2)
              </p>
            </>
          )}

          {showInterior && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md bg-red-600 px-4 py-2 font-bold text-white transition-colors hover:bg-red-700"
            >
              Back to Traffic View
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAP */}
      {/* ------------------------------------------------------------------ */}

      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onClick={handleMapClick}
        interactiveLayerIds={["mugna-fill"]}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{
          width: "100%",
          height: "100%",
        }}
        onWheel={(event) => {
          if (event.originalEvent.ctrlKey) {
            mapRef.current?.getMap().scrollZoom.enable();
          } else {
            mapRef.current?.getMap().scrollZoom.disable();
          }
        }}
      >
        {/* ================================================================ */}
        {/* MUGNA POLYGON */}
        {/* ================================================================ */}
        <Source type="geojson" data={mugnaZoneGeoJSON}>
          {/* MUGNA area */}
          <Layer
            id="mugna-fill"
            type="fill"
            paint={{
              "fill-color": "#a855f7",
              "fill-opacity": showInterior ? 0.08 : 0.6,
            }}
          />
          {/* MUGNA boundary */}
          <Layer
            id="mugna-outline"
            type="line"
            paint={{
              "line-color": "#a855f7",
              "line-width": showInterior ? 3 : 2,
              "line-opacity": showInterior ? 0.8 : 1,
            }}
          />
          {/* MUGNA label */}
          <Layer
            id="mugna-label"
            type="symbol"
            layout={{
              "text-field": "MUGNA",
              "text-size": 24,
            }}
            paint={{
              "text-color": "#000000",
              "text-opacity": showInterior ? 0 : 1,
            }}
          />
        </Source>

        {/* ================================================================ */}
        {/* ROUTES */}
        {/* ================================================================ */}

        <Source type="geojson" data={routesGeoJSON}>
          {/* ================================================================ */}
          {/* ROUTE LINES (Rendered first, acts as background)                 */}
          {/* ================================================================ */}

          <Layer
            id="route-lines"
            type="line"
            filter={
              selectedRoute
                ? ["in", "id", ...ROUTE_GROUPS[selectedRoute]]
                : ["has", "id"] // <-- FIX: Explicit fallback to show all lines initially instead of undefined
            }
            paint={{
              "line-color": ["get", "color"],
              "line-width": 6,
              "line-opacity": showInterior ? 0.3 : 1,
            }}
          />

          {/* ================================================================ */}
          {/* ARROWS (Rendered second, sits on top like a high z-index)        */}
          {/* ================================================================ */}

          {/* One-way arrows */}
          <Layer
            id="route-arrows"
            type="symbol"
            layout={{
              "symbol-placement": "line",
              "symbol-spacing": 100,
              "text-field": "➤",
              "text-size": 20,
              "text-keep-upright": false,
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={[
              "all",
              [
                "any",
                ["==", "id", "green-entrance"],
                ["==", "id", "green-entrance-2"],
                ["==", "id", "red-exit"],
                ["==", "id", "new-frontier-homeowners"],
                ["==", "id", "new-frontier-homeowners-2"],
              ],
              ...(selectedRoute
                ? [["in", "id", ...ROUTE_GROUPS[selectedRoute]]]
                : []),
            ]}
          />

          {/* Orange forward */}
          <Layer
            id="route-arrows-forward"
            type="symbol"
            layout={{
              "symbol-placement": "line",
              "symbol-spacing": 50,
              "text-field": "➤",
              "text-size": 20,
              "text-keep-upright": false,
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={[
              "all",
              ["==", "id", "orange-exit"],
              ...(selectedRoute
                ? [["in", "id", ...ROUTE_GROUPS[selectedRoute]]]
                : []),
            ]}
          />

          {/* Orange backward */}
          <Layer
            id="route-arrows-backward"
            type="symbol"
            layout={{
              "symbol-placement": "line",
              "symbol-spacing": 50,
              "text-field": "➤",
              "text-size": 20,
              "text-keep-upright": false,
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={[
              "all",
              ["==", "id", "orange-exit-backwards"],
              ...(selectedRoute
                ? [["in", "id", ...ROUTE_GROUPS[selectedRoute]]]
                : []),
            ]}
          />
        </Source>

        {/* ================================================================ */}
        {/* INTERIOR DETAILS */}
        {/* ================================================================ */}

        {showInterior && (
          <Source type="geojson" data={interiorDetailsGeoJSON}>
            {/* Interior points */}
            <Layer
              id="interior-points"
              type="circle"
              paint={{
                "circle-radius": 10,
                "circle-color": [
                  "match",
                  ["get", "type"],
                  "food",
                  "#ef4444",
                  "attraction",
                  "#3b82f6",
                  "stage",
                  "#a855f7",
                  "parking",
                  "#f0c404",
                  "#cccccc",
                ],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              }}
            />

            {/* Interior labels */}
            <Layer
              id="interior-labels"
              type="symbol"
              layout={{
                "text-field": ["get", "name"],
                "text-offset": [0, 1.5],
                "text-size": 14,
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#333333",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              }}
            />
          </Source>
        )}
      </Map>

      {/* ------------------------------------------------------------------ */}
      {/* LEGEND */}
      {/* ------------------------------------------------------------------ */}

      {!showInterior && (
        <div className="absolute bottom-3 left-3 max-sm:right-3 sm:bottom-10 sm:left-10">
          <div
            className={cn(
              "max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out",
            )}
          >
            <button
              type="button"
              onClick={() => setShowLegend((prev) => !prev)}
              aria-expanded={showLegend}
              aria-label={showLegend ? "Collapse legend" : "Expand legend"}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-gray-200 px-5 py-3 text-left text-lg font-bold text-black transition-colors hover:bg-gray-300 active:bg-gray-400"
            >
              <span>Legend</span>

              <ChevronUp
                className={cn(
                  "size-5 shrink-0 transition-transform duration-300",
                  !showLegend && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                showLegend ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden px-5",
                  showLegend ? "mt-4 pb-5" : "",
                )}
              >
                {/* Green route */}
                <button
                  type="button"
                  onClick={() => selectRoute("green")}
                  className={cn(
                    "mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors",
                    selectedRoute === "green"
                      ? "bg-green-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div className="h-5 w-5 shrink-0 rounded-full bg-green-500" />

                  <p className="text-sm leading-tight text-gray-700">
                    <strong>Entrance from Tambo Trafficlight</strong>
                  </p>
                </button>

                {/* Orange route */}
                <button
                  type="button"
                  onClick={() => selectRoute("orange")}
                  className={cn(
                    "mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors",
                    selectedRoute === "orange"
                      ? "bg-orange-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div className="h-5 w-5 shrink-0 rounded-full bg-orange-500" />

                  <p className="text-sm leading-tight text-gray-700">
                    <strong>Entrance from Franciscan</strong>
                    <br />
                    <span className="text-xs">
                      Exit to H30 <em>(Di pwede mu diretso sa MUGNA)</em>
                    </span>
                  </p>
                </button>

                {/* Blue route */}
                <button
                  type="button"
                  onClick={() => selectRoute("blue")}
                  className={cn(
                    "mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors",
                    selectedRoute === "blue"
                      ? "bg-blue-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div className="h-5 w-5 shrink-0 rounded-full bg-blue-600" />

                  <p className="text-sm leading-tight text-gray-700">
                    <strong>New Frontier Home Owners</strong>
                    <br />
                    <span className="text-xs">Entrance ONLY</span>
                  </p>
                </button>

                {/* Red route */}
                <button
                  type="button"
                  onClick={() => selectRoute("red")}
                  className={cn(
                    "mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors",
                    selectedRoute === "red" ? "bg-red-50" : "hover:bg-gray-50",
                  )}
                >
                  <div className="h-5 w-5 shrink-0 rounded-full bg-red-600" />

                  <p className="text-sm leading-tight text-gray-700">
                    <strong>EXIT route (H30)</strong>
                  </p>
                </button>

                {/* No parking */}
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm leading-tight text-red-700">
                    <strong>NO PARKING:</strong> Gikan sa Tambo Traffic Light
                    hangtod sa Hi-way 30.
                  </p>
                </div>

                {/* Traffic reminder */}
                <p className="mt-3 text-center text-xs leading-tight text-gray-500 italic">
                  Palihog sundon ang mga traffic signs ug billboards along sa
                  <br className="hidden sm:block" />
                  hapsay nga dagan sa trapiko.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
