'use client'

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Search, LocateFixed, Phone, MapPin, X, ChevronLeft, Loader2,
} from 'lucide-react';
import type { DisasterFacility } from '@/validations/disasterSchema';
import { CATEGORY_META, CATEGORY_ORDER, telHref, type Category } from '../facilityMeta';
import { HAZARDS, HAZARD_ORDER, HAZARD_SOURCE, type HazardKey } from './hazards';

const DisasterMapLeaflet = dynamic(() => import('./DisasterMapLeaflet'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-500 font-medium">
            Loading map…
        </div>
    ),
});

// Great-circle distance in km — used to rank facilities against the user's
// location for the "nearest" hint.
function distanceKm(a: [number, number], b: [number, number]): number {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return 2 * R * Math.asin(Math.sqrt(h));
}

export default function DisasterMapView({ facilities }: { facilities: DisasterFacility[] }) {
    const [query, setQuery] = useState('');
    // Barangay pins (44) start hidden so emergency services read clearly; the
    // filter chip reveals them on demand.
    const [active, setActive] = useState<Set<Category>>(
        () => new Set(CATEGORY_ORDER.filter((c) => c !== "barangay")),
    );
    const [selected, setSelected] = useState<DisasterFacility | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState<string | null>(null);
    const [hazards, setHazards] = useState<Set<HazardKey>>(() => new Set());

    function toggleHazard(key: HazardKey) {
        setHazards((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    const availableCategories = useMemo(
        () => CATEGORY_ORDER.filter((c) => facilities.some((f) => f.category === c)),
        [facilities],
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = facilities.filter(
            (f) =>
                active.has(f.category) &&
                (q === '' ||
                    f.name.toLowerCase().includes(q) ||
                    (f.address ?? '').toLowerCase().includes(q)),
        );
        if (userLocation) {
            return [...list].sort(
                (a, b) =>
                    distanceKm(userLocation, [a.lat, a.lon]) -
                    distanceKm(userLocation, [b.lat, b.lon]),
            );
        }
        return list;
    }, [facilities, active, query, userLocation]);

    function toggle(category: Category) {
        setActive((prev) => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    }

    function locateMe() {
        if (!('geolocation' in navigator)) {
            setLocError('Geolocation is not available on this device.');
            return;
        }
        setLocating(true);
        setLocError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                setLocating(false);
            },
            (e) => {
                setLocError(e.code === e.PERMISSION_DENIED ? 'Location permission denied.' : 'Could not get your location.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100dvh-4rem)] min-h-[520px] border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            {/* SIDEBAR: search, filters, list or detail */}
            <div className="lg:w-96 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 h-2/5 lg:h-full">
                {selected ? (
                    <FacilityDetail
                        facility={selected}
                        distance={userLocation ? distanceKm(userLocation, [selected.lat, selected.lon]) : null}
                        onBack={() => setSelected(null)}
                    />
                ) : (
                    <>
                        <div className="p-3 border-b border-slate-100 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search facilities…"
                                    aria-label="Search facilities"
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {availableCategories.map((category) => {
                                    const { label, color } = CATEGORY_META[category];
                                    const on = active.has(category);
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => toggle(category)}
                                            aria-pressed={on}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                                                on ? 'text-white border-transparent' : 'text-slate-500 bg-white border-slate-200'
                                            }`}
                                            style={on ? { backgroundColor: color } : undefined}
                                        >
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: on ? '#fff' : color }} />
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={locateMe}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
                                    disabled={locating}
                                >
                                    {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                                    {userLocation ? 'Sorted by nearest' : 'Find nearest to me'}
                                </button>
                                {HAZARD_ORDER.map((key) => {
                                    const { label, icon: Icon } = HAZARDS[key];
                                    const on = hazards.has(key);
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => toggleHazard(key)}
                                            aria-pressed={on}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                on
                                                    ? 'bg-slate-800 text-white border-transparent'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                            {locError && <p className="text-xs text-red-600 mt-1.5">{locError}</p>}
                        </div>

                        <ul className="flex-1 overflow-y-auto p-2 space-y-1.5">
                            {visible.length === 0 && (
                                <li className="p-4 text-sm text-slate-400 text-center">No facilities match your filters.</li>
                            )}
                            {visible.map((f) => {
                                const { label, color } = CATEGORY_META[f.category];
                                const dist = userLocation ? distanceKm(userLocation, [f.lat, f.lon]) : null;
                                return (
                                    <li key={f.name}>
                                        <button
                                            onClick={() => setSelected(f)}
                                            className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                                <span className="font-bold text-slate-900 text-sm leading-tight">{f.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1 pl-4.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                                                {dist !== null && (
                                                    <span className="text-[10px] font-bold text-blue-600">{dist.toFixed(1)} km</span>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>

            {/* MAP */}
            <div className="relative flex-1 z-0 isolate bg-slate-100 h-3/5 lg:h-full">
                <DisasterMapLeaflet
                    facilities={visible}
                    selected={selected}
                    onSelect={setSelected}
                    userLocation={userLocation}
                    activeHazards={[...hazards]}
                />

                {hazards.size > 0 && (
                    <div className="absolute bottom-3 left-3 z-[500] space-y-2">
                        {HAZARD_ORDER.filter((k) => hazards.has(k)).map((key) => {
                            const { legend, colors } = HAZARDS[key];
                            return (
                                <div
                                    key={key}
                                    className="rounded-lg bg-white/95 backdrop-blur-sm shadow-md border border-slate-200 px-3 py-2 text-[11px]"
                                >
                                    <p className="font-bold text-slate-700 mb-1">{legend}</p>
                                    <div className="flex items-center gap-3">
                                        {(['Low', 'Medium', 'High'] as const).map((l, i) => (
                                            <span key={l} className="inline-flex items-center gap-1 text-slate-600">
                                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[i] }} />
                                                {l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <p className="text-[10px] text-slate-500 px-1">
                            Source:{' '}
                            <a href={HAZARD_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
                                {HAZARD_SOURCE.name}
                            </a>{' '}
                            · {HAZARD_SOURCE.license}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FacilityDetail({
    facility,
    distance,
    onBack,
}: {
    facility: DisasterFacility;
    distance: number | null;
    onBack: () => void;
}) {
    const { label, color } = CATEGORY_META[facility.category];
    return (
        <div className="flex flex-col h-full">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
                    <ChevronLeft className="w-4 h-4" /> All facilities
                </button>
                <button onClick={onBack} aria-label="Close details" className="p-1 text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 overflow-y-auto">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white rounded px-2 py-0.5 mb-2" style={{ backgroundColor: color }}>
                    {label}
                </span>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{facility.name}</h2>
                {facility.address && <p className="text-sm text-slate-500 mt-1">{facility.address}</p>}
                {distance !== null && (
                    <p className="text-sm font-bold text-blue-600 mt-2">{distance.toFixed(1)} km from you</p>
                )}

                <div className="flex flex-col gap-2 mt-4">
                    {facility.tel && (
                        <a href={telHref(facility.tel)} className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
                            <Phone className="w-4 h-4" /> Call {facility.tel}
                        </a>
                    )}
                    <a
                        href={`https://www.openstreetmap.org/directions?to=${facility.lat}%2C${facility.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        <MapPin className="w-4 h-4" /> Get directions
                    </a>
                </div>

                <p className="text-[11px] text-slate-400 mt-4">
                    Location from{' '}
                    <a href={facility.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                        OpenStreetMap
                    </a>{' '}
                    · verified {facility.verifiedAt}. Approximate — confirm with the CDRRMO.
                </p>
            </div>
        </div>
    );
}
