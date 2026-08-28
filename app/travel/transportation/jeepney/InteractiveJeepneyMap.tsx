'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import MapGL, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import bbox from '@turf/bbox';
import type { GeoJsonObject } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Eye, EyeOff } from 'lucide-react';
import jeepneyCodesData from '@/data/travel/jeepneyCoding.json';
import jeepneyRoutesData from '@/data/travel/jeepney-routes.json';
import iliganBoundaryData from '@/data/travel/iligan-city-boundary.json'

import DesktopJeepneySidebar from './DesktopJeepneySidebar';

const geoJsonData = jeepneyRoutesData as GeoJsonObject;
const boundaryGeoJsonData = iliganBoundaryData as GeoJsonObject;

type JeepneyFare = {
    regular: number;
    discounted: number; // student / PWD / senior citizen rate
};

type JeepneyCodeEntry = {
    routeId: string;        // must match the routeId used in jeepney-routes.json
    routeCode: string;      // short display code, e.g. "SF-AC"
    routeColor?: string;    // customizable color for this route's badge/border — overrides the geojson's own "stroke"
    routeFare?: JeepneyFare;
};

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
            (f) => f.properties.routeId === activeRouteId
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
            }
        );
    }, [activeRouteId, mapRef]);

    return null;
}

export default function InteractiveJeepneyMap() {
    const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
    const [showAllRoutes, setShowAllRoutes] = useState(true);
    const mapRef = useRef<MapRef>(null);
    // --- NEW: 3-Phase Animation State ---
    const [sidebarPhase, setSidebarPhase] = useState<'closed' | 'peek' | 'open'>('open');
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
        return entry?.routeColor || fallbackStroke || '#3B82F6';
    };

    const routeColorExpression = useMemo(() => {
        const expression: any[] = ['match', ['get', 'routeId']];

        jeepneyRoutesData.features.forEach((feature) => {
            const routeId = feature.properties.routeId;
            const color = getRouteColor(
                routeId,
                feature.properties.stroke
            );

            expression.push(routeId, color);
        });

        expression.push('#3B82F6');

        return expression;
    }, [codeLookup]);

    const handleMapClick = (event: MapLayerMouseEvent) => {
        const features = event.target.queryRenderedFeatures(
            event.point,
            {
                layers: ['jeepney-route-hitbox'],
            }
        );

        if (!features.length) return;

        const routeId = features[0].properties?.routeId;

        if (typeof routeId !== 'string') return;

        setActiveRouteId(routeId);
        setShowAllRoutes(false);
    };

    // Track the phase in a ref to avoid stale closures inside useEffects
    const phaseRef = useRef(sidebarPhase);
    useEffect(() => {
        phaseRef.current = sidebarPhase;
    }, [sidebarPhase]);

    const toggleSidebar = () => {
        if (sidebarPhase === 'closed') {
            setIsClosing(false);
            setSidebarPhase('peek');
            setTimeout(() => setSidebarPhase('open'), 250);
        } else if (sidebarPhase === 'open') {
            setIsClosing(true);
            setSidebarPhase('peek');
            setTimeout(() => setSidebarPhase('closed'), 350);
        }
    };

    // --- NEW: Safe opening mechanism avoiding Leaflet stale closures ---
    useEffect(() => {
        if (activeRouteId && phaseRef.current === 'closed') {
            setIsClosing(false);
            setSidebarPhase('peek');
            setTimeout(() => setSidebarPhase('open'), 250);
        }
    }, [activeRouteId]);

    return (
        <div className="fixed inset-0 z-[100]">

            {/* --- MAP LAYER (Background) --- */}
            <MapGL
                ref={mapRef}
                initialViewState={{
                    longitude: 124.2452,
                    latitude: 8.2280,
                    zoom: 18,
                    pitch: 60,
                    bearing: -20,
                }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
                onClick={handleMapClick}
                interactiveLayerIds={['jeepney-route-hitbox']}
            >
                <NavigationControl
                    position="bottom-right"
                    showCompass
                    showZoom
                />
                <FitToRoute activeRouteId={activeRouteId} mapRef={mapRef} />

                <Source
                    id="iligan-boundary"
                    type="geojson"
                    data={boundaryGeoJsonData}
                >
                    <Layer
                        id="iligan-boundary-line"
                        type="line"
                        paint={{
                            'line-color': '#94a3b8',
                            'line-width': 2,
                            'line-dasharray': [4, 4],
                        }}
                    />

                    <Layer
                        id="iligan-boundary-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#cbd5e1',
                            'fill-opacity': 0.05,
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

                <Source
                    id="jeepney-routes"
                    type="geojson"
                    data={geoJsonData}
                >
                    {/* Mobile-friendly invisible hitbox */}
                    <Layer
                        id="jeepney-route-hitbox"
                        type="line"
                        paint={{
                            'line-color': '#000000',
                            'line-width': 24,
                            'line-opacity': 0,
                        }}
                    />

                    {/* Visible routes */}
                    <Layer
                        id="jeepney-routes"
                        type="line"
                        paint={{
                            'line-color': routeColorExpression,
                            'line-width': [
                                'case',
                                ['==', ['get', 'routeId'], activeRouteId ?? ''],
                                6,
                                3,
                            ],
                            'line-opacity': [
                                'case',
                                ['==', ['get', 'routeId'], activeRouteId ?? ''],
                                1,
                                showAllRoutes ? 0.6 : 0,
                            ],
                        }}
                    />
                </Source>
            </MapGL>

            {/* --- FLOATING LEFT SIDEBAR --- */}
            <DesktopJeepneySidebar
                sidebarPhase={sidebarPhase}
                isClosing={isClosing}
                toggleSidebar={toggleSidebar}
                activeRouteId={activeRouteId}
                setActiveRouteId={setActiveRouteId}
                codeLookup={codeLookup}
                getRouteColor={getRouteColor}
            />

            <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-col gap-2">

                <button
                    onClick={() => {
                        setShowAllRoutes(!showAllRoutes);
                        if (!showAllRoutes) setActiveRouteId(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-md border font-bold text-xs sm:text-sm transition-all ${showAllRoutes
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    {showAllRoutes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="hidden sm:inline">{showAllRoutes ? 'Hide' : 'Show'} All Routes</span>
                </button>

            </div>
        </div >
    );
}
