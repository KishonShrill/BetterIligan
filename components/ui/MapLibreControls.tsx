"use client";

import { type RefObject, useState, useEffect } from "react";
import { Compass, Minus, Plus, Mountain } from "lucide-react";
import { type MapRef } from "react-map-gl/maplibre";

interface MapControlsProps {
  mapRef: RefObject<MapRef | null>;
  isTerrainEnabled: boolean;
  onToggleTerrain: () => void;
}

export default function MapControls({
  mapRef,
  isTerrainEnabled,
  onToggleTerrain,
}: MapControlsProps) {
  const [is3D, setIs3D] = useState(true);
  // NEW: State to track the map's rotation
  const [bearing, setBearing] = useState(45); // Default to map's initial bearing

  // NEW: Listen to map rotation events to update the compass icon
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleRotate = () => {
      setBearing(map.getBearing() + 45);
    };

    // Set the initial bearing just in case
    handleRotate();

    // Listen for user rotation/bearing changes
    map.on("rotate", handleRotate);

    return () => {
      map.off("rotate", handleRotate);
    };
  }, [mapRef.current]);

  const handleZoomIn = () => mapRef.current?.zoomIn();

  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleCompass = () => {
    mapRef.current?.easeTo({
      bearing: 0,
      duration: 500,
    });
  };

  const handle3D = () => {
    const nextIs3D = !is3D;
    setIs3D(nextIs3D);

    mapRef.current?.easeTo({
      pitch: nextIs3D ? 60 : 0,
      bearing: nextIs3D ? -20 : 0,
      duration: 700,
    });
  };

  return (
    <div className="pointer-events-auto absolute right-3 bottom-3 z-[1000] flex flex-col gap-2 sm:bottom-11">
      {/* Detached 3D Button */}
      <button
        type="button"
        onClick={handle3D}
        aria-label="Toggle 3D view"
        className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-xl transition-colors hover:bg-slate-50 active:bg-slate-100 ${
          is3D
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        <span className="text-sm font-black tracking-tighter">3D</span>
      </button>

      {/* Detached Terrain Button */}
      <button
        type="button"
        onClick={onToggleTerrain}
        aria-label="Toggle terrain and elevation"
        className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-xl transition-colors hover:bg-slate-50 active:bg-slate-100 ${
          isTerrainEnabled
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        <Mountain className="h-5 w-5" />
      </button>

      {/* Zoom & Compass Group */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="flex h-11 w-11 items-center justify-center text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
        >
          <Plus className="h-5 w-5" />
        </button>

        <div className="h-px bg-slate-200" />

        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="flex h-11 w-11 items-center justify-center text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
        >
          <Minus className="h-5 w-5" />
        </button>

        <div className="h-px bg-slate-200" />

        <button
          type="button"
          onClick={handleCompass}
          aria-label="Reset map orientation"
          className="flex h-11 w-11 items-center justify-center text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
        >
          {/* NEW: Dynamic rotation style applied to the icon */}
          <Compass
            className="h-5 w-5 transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${-bearing}deg)` }}
          />
        </button>
      </div>
    </div>
  );
}
