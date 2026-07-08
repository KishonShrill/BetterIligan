'use client'

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Waterfall } from '@/validations/waterfallSchema';

const FALL_COLOR = '#0891b2';

function pinIcon(): L.DivIcon {
    return L.divIcon({
        className: '',
        html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">
            <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z" fill="${FALL_COLOR}"/>
            <circle cx="13" cy="13" r="5" fill="#ffffff"/>
        </svg>`,
        iconSize: [26, 34],
        iconAnchor: [13, 34],
        popupAnchor: [0, -32],
    });
}

function FitToFalls({ falls }: { falls: Waterfall[] }) {
    const map = useMap();
    useEffect(() => {
        if (falls.length === 0) return;
        map.fitBounds(L.latLngBounds(falls.map((f) => [f.lat, f.lon])), { padding: [45, 45], maxZoom: 12 });
    }, [falls, map]);
    return null;
}

function FixResize() {
    const map = useMap();
    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 150);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

export default function WaterfallsMap({ falls }: { falls: Waterfall[] }) {
    return (
        <MapContainer center={[8.2, 124.25]} zoom={11} className="w-full h-full" scrollWheelZoom={false}>
            <FixResize />
            <FitToFalls falls={falls} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {falls.map((f) => (
                <Marker key={f.name} position={[f.lat, f.lon]} icon={pinIcon()}>
                    <Popup>
                        <div className="min-w-[11rem]">
                            {f.photo && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={f.photo.url} alt={f.name} className="w-full h-24 object-cover rounded mb-1.5" />
                            )}
                            <p className="font-bold text-slate-900">{f.name}</p>
                            {f.area && <p className="text-xs text-slate-500">{f.area}</p>}
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat}%2C${f.lon}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-1.5 text-xs font-bold text-cyan-700 underline"
                            >
                                Directions →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
