'use client'

import React, { useState, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { GeoJsonObject, Feature, LineString, MultiLineString } from 'geojson';
import { Maximize, Minimize, Eye, EyeOff, Banknote, GraduationCap } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import kalesaRoutesData from '@/data/travel/kalesaRoutes.json';
import kalesaFareData from '@/data/travel/kalesaFare.json';

const geoJsonData = kalesaRoutesData as GeoJsonObject;

interface FareDetail {
    regular: number;
    discounted: number;
}

interface KalesaFareItem {
    routeCode?: string;
    routeColor?: string;
    routeFare?: FareDetail;
}

interface RouteProperties {
    routeId: string;
    name: string;
    stroke?: string;
    fare?: FareDetail;
}

function FixMapResize({ isFullscreen }: { isFullscreen: boolean }) {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 150);
        return () => clearTimeout(timer);
    }, [isFullscreen, map]);

    return null;
}

function FitToRoute({ activeRouteId }: { activeRouteId: string | null }) {
    const map = useMap();

    useEffect(() => {
        if (!activeRouteId) return;

        const selectedFeature = kalesaRoutesData.features.find(
            (f) => f.properties?.routeId === activeRouteId
        ) as Feature<LineString | MultiLineString> | undefined;

        if (!selectedFeature || !selectedFeature.geometry) return;

        const coordinates: [number, number][] = [];
        const geom = selectedFeature.geometry;

        if (geom.type === 'LineString') {
            geom.coordinates.forEach((coord) => coordinates.push([coord[1], coord[0]]));
        } else if (geom.type === 'MultiLineString') {
            geom.coordinates.forEach((line) =>
                line.forEach((coord) => coordinates.push([coord[1], coord[0]]))
            );
        }

        if (coordinates.length > 0) {
            const bounds = L.latLngBounds(coordinates);
            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 15,
                animate: true,
                duration: 0.5
            });
        }
    }, [activeRouteId, map]);

    return null;
}

export default function InteractiveKalesaMap() {
    const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
    const [showAllRoutes, setShowAllRoutes] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const fareMap = useMemo(() => {
        const map = new Map<string, KalesaFareItem>();
        (kalesaFareData as KalesaFareItem[]).forEach((item) => {
            if (item.routeCode) {
                map.set(item.routeCode, item);
            }
        });
        return map;
    }, []);

    const containerClasses = isFullscreen
        ? "fixed inset-0 z-[100] bg-slate-50 flex flex-col lg:flex-row h-[100dvh] w-screen"
        : "grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[800px] lg:h-auto";

    return (
        <div className={containerClasses}>
            {/* LEFT SIDEBAR */}
            <div className={`border-r border-slate-100 rounded-r-2xl flex flex-col bg-white ${isFullscreen ? 'w-full lg:w-80 h-1/3 lg:h-full shrink-0' : 'lg:col-span-4 h-[300px] lg:h-[600px]'}`}>
                <div className="p-4 border-b border-slate-100 rounded-r-2xl bg-slate-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Kalesa Routes</h2>
                        <p className="text-xs text-slate-500">Select a route to view it &amp; check the fare</p>
                    </div>
                </div>

                <ul className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {kalesaRoutesData.features.map((feature, idx) => {
                        const props = feature.properties as unknown as RouteProperties;
                        const routeId = props?.routeId || `route-${idx}`;
                        const isActive = activeRouteId === routeId;

                        const fareData = fareMap.get(routeId);
                        const routeColor = fareData?.routeColor || props?.stroke || '#3B82F6';
                        const fare = fareData?.routeFare || props?.fare;

                        return (
                            <li key={routeId}>
                                <button
                                    onClick={() => {
                                        setActiveRouteId(isActive ? null : routeId);
                                        if (!isActive) setShowAllRoutes(false);
                                    }}
                                    style={{ borderLeftColor: routeColor, borderLeftWidth: 4 }}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${isActive
                                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm px-1 text-center leading-none"
                                            style={{ backgroundColor: routeColor }}
                                        >
                                            {routeId}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-slate-900 leading-tight truncate">{props?.name || 'Unnamed Route'}</div>
                                            <div
                                                className="text-[10px] font-bold tracking-wider uppercase mt-0.5"
                                                style={{ color: routeColor }}
                                            >
                                                Route {routeId}
                                            </div>
                                        </div>
                                    </div>

                                    {isActive && (
                                        fare ? (
                                            <div className="mt-3 pt-3 border-t border-blue-100 grid grid-cols-2 gap-2">
                                                <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-2">
                                                    <div className="flex items-center gap-1.5 text-emerald-700">
                                                        <Banknote className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide">Regular</span>
                                                    </div>
                                                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                                                        ₱{fare.regular}
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-2">
                                                    <div className="flex items-center gap-1.5 text-indigo-700">
                                                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide">Student / PWD</span>
                                                    </div>
                                                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                                                        ₱{fare.discounted}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2">
                                                <Banknote className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="text-sm font-semibold text-slate-500">Fare not yet available</span>
                                            </div>
                                        )
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* RIGHT MAP */}
            <div className={`relative z-0 bg-slate-100 isolate ${isFullscreen ? 'w-full h-2/3 lg:h-full flex-1' : 'lg:col-span-8 h-[500px] lg:h-[600px]'}`}>
                {/* FLOATING CONTROLS */}
                <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-col gap-2">
                    <button
                        onClick={() => {
                            const nextState = !showAllRoutes;
                            setShowAllRoutes(nextState);
                            if (nextState) setActiveRouteId(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border font-bold text-xs transition-all ${showAllRoutes
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {showAllRoutes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="hidden sm:inline">{showAllRoutes ? 'Hide' : 'Show'} All Routes</span>
                    </button>

                    <button
                        onClick={() => {
                            setIsFullscreen(!isFullscreen);
                            setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-white text-slate-700 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all ml-auto"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>

                {/* LEAFLET MAP */}
                <MapContainer
                    center={[8.2280, 124.2452]}
                    zoom={13}
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <FixMapResize isFullscreen={isFullscreen} />
                    <FitToRoute activeRouteId={activeRouteId} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    <GeoJSON
                        key={`${activeRouteId}-${showAllRoutes}`}
                        data={geoJsonData}
                        style={(feature) => {
                            const props = feature?.properties as unknown as RouteProperties | undefined;
                            const routeId = props?.routeId || '';
                            const isSpecificActive = routeId === activeRouteId;
                            const fareData = fareMap.get(routeId);
                            const lineColor = fareData?.routeColor || props?.stroke || '#3B82F6';

                            if (isSpecificActive) {
                                return {
                                    color: lineColor,
                                    weight: 6,
                                    opacity: 1,
                                };
                            } else if (showAllRoutes) {
                                return {
                                    color: lineColor,
                                    weight: 3,
                                    opacity: 0.6,
                                };
                            } else {
                                return {
                                    opacity: 0,
                                    fillOpacity: 0,
                                    weight: 0
                                };
                            }
                        }}
                        onEachFeature={(feature, layer) => {
                            layer.on({
                                click: () => {
                                    const props = feature.properties as unknown as RouteProperties;
                                    if (props?.routeId) {
                                        setActiveRouteId(props.routeId);
                                        setShowAllRoutes(false);
                                    }
                                }
                            });
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}