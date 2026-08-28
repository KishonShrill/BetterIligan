'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MapGL, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import bbox from '@turf/bbox';
import type { GeoJsonObject } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Eye, EyeOff, Search, X } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState(''); // --- NEW: Search State ---


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

    // --- NEW: Dynamic Style for the Search Bar ---
    // Mirrors the exact timing of the sidebar's width transition
    const searchStyle = {
        transitionProperty: "transform",
        transitionDuration: (sidebarPhase === 'peek' && !isClosing) || (sidebarPhase === 'closed' && isClosing)
            ? "250ms"
            : "350ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        // 12rem = w-48 (closed), 20rem = w-80 (open), plus 1rem gap
        transform: sidebarPhase === 'closed' ? 'translateX(calc(12rem + 1rem))' : 'translateX(calc(20rem + 1rem))'
    };

    const phaseRef = useRef(sidebarPhase);
    useEffect(() => {
        phaseRef.current = sidebarPhase;
    }, [sidebarPhase]);

    useEffect(() => {
        if (activeRouteId && phaseRef.current === 'closed') {
            setIsClosing(false);
            setSidebarPhase('peek');
            setTimeout(() => setSidebarPhase('open'), 250);
        }
    }, [activeRouteId]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50">

            {/* --- MAP LAYER (Background) --- */}
            <MapGL
                ref={mapRef}
                initialViewState={{
                    longitude: 124.2452,
                    latitude: 8.2280,
                    zoom: 16,
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
                searchQuery={searchQuery}
            />
            <div
                className="max-md:hidden absolute top-4 left-4 z-[999] pointer-events-auto bg-white shadow-xl border border-slate-200 rounded-2xl flex items-center px-4 h-[56px] w-64"
                style={searchStyle}
            >
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                    type="text"
                    placeholder="Search routes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // Opens the sidebar automatically if they type while it's closed
                    onFocus={() => sidebarPhase === 'closed' && toggleSidebar()}
                    className="outline-none text-sm bg-transparent w-full text-slate-700 placeholder:text-slate-400 font-medium"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <div className='absolute bottom-4 left-4 p-2 rounded-2xl shadow-xl pointer-events-auto bg-slate-50'>
                <Link href="/" aria-label="BetterIligan home" className="flex items-center gap-2 transition-opacity hover:opacity-80">
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

            <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-col gap-2">
                <button
                    onClick={() => {
                        setShowAllRoutes(!showAllRoutes);
                        if (!showAllRoutes) setActiveRouteId(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 sm:h-[56px] rounded-xl shadow-md border font-bold text-xs sm:text-sm transition-all ${showAllRoutes
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
