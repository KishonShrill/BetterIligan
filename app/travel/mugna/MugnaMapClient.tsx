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

setWorkerUrl(workerUrl);

import ReferencesFooter from "@/components/ui/ReferencesFooter";

const REFERENCES = [
  {
    title:
      "City Government of Iligan - 𝐌𝐔𝐆𝐍𝐀 𝐒𝐀 𝐈𝐋𝐈𝐆𝐀𝐍 𝐓𝐑𝐀𝐅𝐅𝐈𝐂 𝐑𝐎𝐔𝐓𝐄𝐒 & 𝐏𝐀𝐑𝐊𝐈𝐍𝐆 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍𝐒",
    url: "https://www.facebook.com/photo?fbid=1075954835191568",
  },
];

export default function MugnaMap() {
  const mapRef = useRef<MapRef | null>(null);
  const [showInterior, setShowInterior] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
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

      if (!features || features.length === 0) {
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

        return;
      }

      const clickedFeature = features[0];

      // User clicked the MUGNA polygon
      if (clickedFeature.layer?.id === "mugna-fill") {
        setShowInterior(true);

        mapRef.current?.flyTo({
          center: [124.25, 8.24928],
          zoom: 18.5,
          pitch: 45,
          bearing: 0,
          duration: 1200,
        });
      }
    },
    [showInterior],
  );

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
        {/* ROUTES */}
        {/* ================================================================ */}

        <Source type="geojson" data={routesGeoJSON}>
          {/* Main route lines */}
          <Layer
            id="route-lines"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 6,
              "line-opacity": showInterior ? 0.3 : 1,
            }}
          />

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
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={[
              "any",
              ["==", "id", "green-entrance"],
              ["==", "id", "green-entrance-2"],
            ]}
          />

          {/* Two-way arrows → */}
          <Layer
            id="route-arrows-forward"
            type="symbol"
            layout={{
              "symbol-placement": "line",
              "symbol-spacing": 50,
              "text-field": "➤",
              "text-size": 20,
              "text-keep-upright": false,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={["==", "id", "orange-exit"]}
          />

          {/* Two-way arrows ← */}
          <Layer
            id="route-arrows-backward"
            type="symbol"
            layout={{
              "symbol-placement": "line",
              "symbol-spacing": 50,
              "text-field": "➤",
              "text-size": 20,
              "text-keep-upright": false,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
              "text-opacity": showInterior ? 0 : 1,
            }}
            filter={["==", "id", "orange-exit-backwards"]}
          />
        </Source>

        {/* ================================================================ */}
        {/* MUGNA ZONE */}
        {/* ================================================================ */}

        <Source type="geojson" data={mugnaZoneGeoJSON}>
          {/* MUGNA polygon */}
          <Layer
            id="mugna-fill"
            type="fill"
            paint={{
              "fill-color": "#FFD700",
              "fill-opacity": showInterior ? 0.1 : 0.6,
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
                <div className="mb-2 flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-green-500" />

                  <p className="text-sm text-gray-700">
                    <strong>Entrance:</strong> One-way gikan sa Tambo Traffic
                    Light (kilid sa Floor Center) padulong sa Mugna.
                  </p>
                </div>

                {/* Orange route */}
                <div className="mb-2 flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-orange-500" />

                  <p className="text-sm text-gray-700">
                    <strong>Entrance / Exit:</strong> Likod sa Hi-way 30 o agi
                    sa Franciscan Road (two-way).{" "}
                    <em>(Di pwede mu diretso sa MUGNA)</em>
                  </p>
                </div>

                {/* No parking */}
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    <strong>NO PARKING:</strong> Gikan sa Tambo Traffic Light
                    hangtod sa Hi-way 30.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
