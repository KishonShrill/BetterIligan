'use client'

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Circle, GeoJSON, useMap } from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import 'leaflet/dist/leaflet.css';
import type { DisasterFacility } from '@/validations/disasterSchema';
import { CATEGORY_META } from '../facilityMeta';
import { HAZARDS, type HazardKey } from './hazards';

// Fetch-on-demand NOAH hazard overlay; the geojson only loads when its layer is
// turned on. `lvl` 1/2/3 maps to the hazard's Low/Medium/High colors.
function HazardLayer({ hazard }: { hazard: HazardKey }) {
    const { url, colors } = HAZARDS[hazard];
    const [data, setData] = useState<GeoJsonObject | null>(null);
    useEffect(() => {
        let cancelled = false;
        fetch(url)
            .then((r) => r.json() as Promise<GeoJsonObject>)
            .then((j) => { if (!cancelled) setData(j); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [url]);

    if (!data) return null;
    return (
        <GeoJSON
            data={data}
            interactive={false}
            style={(feature) => {
                const color = colors[(feature?.properties?.lvl ?? 2) - 1] ?? colors[1];
                return { color, weight: 0.4, opacity: 0.5, fillColor: color, fillOpacity: 0.4 };
            }}
        />
    );
}

// A colored teardrop pin as an SVG divIcon — avoids the broken default Leaflet
// marker-image URLs under webpack bundling, and colors by category.
function pinIcon(color: string, selected: boolean): L.DivIcon {
    const scale = selected ? 1.25 : 1;
    const w = Math.round(26 * scale);
    const h = Math.round(34 * scale);
    return L.divIcon({
        className: '',
        html: `<svg width="${w}" height="${h}" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">
            <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z" fill="${color}"/>
            <circle cx="13" cy="13" r="5" fill="#ffffff"/>
        </svg>`,
        iconSize: [w, h],
        iconAnchor: [w / 2, h],
    });
}

function userIcon(): L.DivIcon {
    return L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
}

function FitToFacilities({ facilities, userLocation }: {
    facilities: DisasterFacility[];
    userLocation: [number, number] | null;
}) {
    const map = useMap();
    useEffect(() => {
        const points: [number, number][] = facilities.map((f) => [f.lat, f.lon]);
        if (userLocation) points.push(userLocation);
        if (points.length === 0) return;
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 14 });
        // Only refit when the user location first appears, not on every filter.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation]);
    return null;
}

function FlyToSelected({ selected }: { selected: DisasterFacility | null }) {
    const map = useMap();
    useEffect(() => {
        if (!selected) return;
        map.flyTo([selected.lat, selected.lon], 16, { duration: 0.6 });
    }, [selected, map]);
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

export default function DisasterMapLeaflet({
    facilities,
    selected,
    onSelect,
    userLocation,
    activeHazards,
}: {
    facilities: DisasterFacility[];
    selected: DisasterFacility | null;
    onSelect: (f: DisasterFacility) => void;
    userLocation: [number, number] | null;
    activeHazards: HazardKey[];
}) {
    return (
        <MapContainer center={[8.228, 124.2452]} zoom={13} className="w-full h-full" zoomControl={false}>
            <FixResize />
            <FitToFacilities facilities={facilities} userLocation={userLocation} />
            <FlyToSelected selected={selected} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · Hazards: <a href="https://noah.up.edu.ph/">UP NOAH</a> (ODbL)'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {activeHazards.map((h) => (
                <HazardLayer key={h} hazard={h} />
            ))}

            {userLocation && (
                <>
                    <Circle center={userLocation} radius={120} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1, weight: 1 }} />
                    <Marker position={userLocation} icon={userIcon()} />
                </>
            )}

            {facilities.map((f) => (
                <Marker
                    key={f.name}
                    position={[f.lat, f.lon]}
                    icon={pinIcon(CATEGORY_META[f.category].color, selected?.name === f.name)}
                    eventHandlers={{ click: () => onSelect(f) }}
                    zIndexOffset={selected?.name === f.name ? 1000 : 0}
                />
            ))}
        </MapContainer>
    );
}
