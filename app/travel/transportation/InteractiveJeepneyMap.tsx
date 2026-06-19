'use client'

import { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import { Maximize, Minimize, Eye, EyeOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import jeepneyRoutesData from '@/data/travel/jeepney-routes.json';
const geoJsonData = jeepneyRoutesData as GeoJsonObject;


function FixMapResize({ isFullscreen }: { isFullscreen: boolean }) {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 150);
    }, [isFullscreen, map]);

    return null;
}

function FitToRoute({ activeRouteId }: { activeRouteId: string | null }) {
    const map = useMap();

    useEffect(() => {
        if (!activeRouteId) return;

        const selectedFeature = jeepneyRoutesData.features.find(
            (f) => f.properties.routeId === activeRouteId
        );

        if (!selectedFeature) return;

        const layer = L.geoJSON(selectedFeature as Feature);
        const bounds = layer.getBounds();

        map.fitBounds(bounds, {
            padding: [20, 20], // adds margin so route isn't touching edges
            maxZoom: 15,        // optional: prevents over-zooming
            animate: true,
            duration: 0.5
        });

    }, [activeRouteId, map]);

    return null;
}

export default function InteractiveJeepneyMap() {
    const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
    const [showAllRoutes, setShowAllRoutes] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerClasses = isFullscreen
        ? "fixed inset-0 z-[100] bg-slate-50 flex flex-col lg:flex-row h-[100dvh] w-screen"
        : "grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[800px] lg:h-auto";

    return (
        <div className={containerClasses}>

            {/* LEFT SIDEBAR: The Route List */}
            <div className={`border-r border-slate-100 rounded-r-2xl flex flex-col bg-white ${isFullscreen ? 'w-full lg:w-80 h-1/3 lg:h-full shrink-0' : 'lg:col-span-4 h-[300px] lg:h-[600px]'}`}>
                <div className="p-4 border-b border-slate-100 rounded-r-2xl bg-slate-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Jeepney Routes</h2>
                        <p className="text-xs text-slate-500">Select a route to view it</p>
                    </div>
                </div>

                <ul className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {jeepneyRoutesData.features.map((feature) => (
                        <li key={feature.properties.routeId}>
                            <button
                                onClick={() => setActiveRouteId(feature.properties.routeId)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${activeRouteId === feature.properties.routeId
                                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Small color dot indicating the route color */}
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: feature.properties.stroke || '#3B82F6' }}
                                    ></div>
                                    <div>
                                        <div className="font-bold text-slate-900 leading-tight">{feature.properties.name}</div>
                                        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-0.5">Route {feature.properties.routeId}</div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* RIGHT MAP: OpenStreetMap via Leaflet */}
            <div className={`relative z-0 bg-slate-100 isolate ${isFullscreen ? 'w-full h-2/3 lg:h-full flex-1' : 'lg:col-span-8 h-[500px] lg:h-[600px]'}`}>

                {/* --- FLOATING CONTROLS --- */}
                <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-col gap-2">

                    {/* Toggle All Routes Button */}
                    <button
                        onClick={() => {
                            setShowAllRoutes(!showAllRoutes);
                            if (!showAllRoutes) setActiveRouteId(null); // Clear specific selection if showing all
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border font-bold text-xs transition-all ${showAllRoutes
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {showAllRoutes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="hidden sm:inline">{showAllRoutes ? 'Hide' : 'Show'} All Routes</span>
                    </button>

                    {/* Fullscreen Toggle Button */}
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

                {/* --- THE LEAFLET MAP --- */}
                <MapContainer
                    center={[8.2280, 124.2452]} // Iligan City Coordinates
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
                        data={geoJsonData}
                        style={(feature) => {
                            const isSpecificActive = feature?.properties.routeId === activeRouteId;

                            if (isSpecificActive) {
                                return {
                                    color: feature?.properties.stroke || '#2563EB',
                                    weight: 6,
                                    opacity: 1,
                                };
                            } else if (showAllRoutes) {
                                return {
                                    color: feature?.properties.stroke || '#94A3B8',
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
                                    setActiveRouteId(feature.properties.routeId);
                                    setShowAllRoutes(false); // Focus strictly on this route when clicked
                                }
                            });
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}
