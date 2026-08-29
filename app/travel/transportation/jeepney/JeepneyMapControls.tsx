'use client';

import { type RefObject, useState } from 'react';
import { Compass, Minus, Plus, Box } from 'lucide-react';
import { type MapRef } from 'react-map-gl/maplibre';

export default function JeepneyMapControls({ mapRef }: { mapRef: RefObject<MapRef | null>; }) {
    const [is3D, setIs3D] = useState(false);

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
        <div
            className="
                absolute
                right-3
                bottom-3
                sm:bottom-11
                z-[1000]
                flex
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-xl
                pointer-events-auto
            "
        >
            <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="
                    flex h-11 w-11
                    items-center justify-center
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    active:bg-slate-100
                "
            >
                <Plus className="h-5 w-5" />
            </button>

            <div className="h-px bg-slate-200" />

            <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="
                    flex h-11 w-11
                    items-center justify-center
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    active:bg-slate-100
                "
            >
                <Minus className="h-5 w-5" />
            </button>

            <div className="h-px bg-slate-200" />

            <button
                type="button"
                onClick={handleCompass}
                aria-label="Reset map orientation"
                className="
                    flex h-11 w-11
                    items-center justify-center
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    active:bg-slate-100
                "
            >
                <Compass className="h-5 w-5" />
            </button>

            <div className="h-px bg-slate-200" />

            <button
                type="button"
                onClick={handle3D}
                aria-label="Enable 3D view"
                className="
                    flex h-11 w-11
                    items-center justify-center
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    active:bg-slate-100
                "
            >
                <Box className="h-5 w-5" />
            </button>
        </div>
    );
}
