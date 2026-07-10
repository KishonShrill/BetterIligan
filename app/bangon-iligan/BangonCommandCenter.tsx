'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
    ShieldCheck, Siren, Phone, LocateFixed, Loader2, MessageSquare, X,
    ShieldAlert, MapPin, Navigation,
} from 'lucide-react';
import type { DisasterFacility } from '@/validations/disasterSchema';
import type { BangonConfig, BoardMessageRow, IncidentReportRow, FeedRow } from '@/validations/bangonSchema';
import { CATEGORY_META, telHref } from '@/app/disaster/facilityMeta';
import BangonLivePanel from './BangonLivePanel';
import HazardReportModal from './HazardReportModal';

// The Leaflet map is client-only (no SSR). Reuses the /disaster renderer.
const DisasterMapLeaflet = dynamic(() => import('@/app/disaster/map/DisasterMapLeaflet'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 font-medium text-slate-500">
            Loading map…
        </div>
    ),
});

export default function BangonCommandCenter({
    facilities,
    feed,
    messages,
    reports,
    pendingMessages,
    pendingReports,
    isAdmin,
    config,
}: {
    facilities: DisasterFacility[];
    feed: FeedRow[];
    messages: BoardMessageRow[];
    reports: IncidentReportRow[];
    pendingMessages: BoardMessageRow[];
    pendingReports: IncidentReportRow[];
    isAdmin: boolean;
    config: BangonConfig;
}) {
    const [selected, setSelected] = useState<DisasterFacility | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locating, setLocating] = useState(false);
    const [panelOpen, setPanelOpen] = useState(true);

    // Standby notice: dismiss persists for the browser session (survives refresh,
    // returns on a fresh open) — per maintainer request. Read after mount so SSR
    // and first client render agree.
    const [standbyDismissed, setStandbyDismissed] = useState(false);
    useEffect(() => {
        // Read after mount so SSR and first client render agree (no hydration flash).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (sessionStorage.getItem('bangon-standby-dismissed')) setStandbyDismissed(true);
    }, []);
    function dismissStandby() {
        sessionStorage.setItem('bangon-standby-dismissed', '1');
        setStandbyDismissed(true);
    }

    function locateMe() {
        if (!('geolocation' in navigator)) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                setLocating(false);
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }

    const active = config.active;

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-100">
            {/* ── Full-bleed map ── */}
            <div className="absolute inset-0 z-0 isolate">
                <DisasterMapLeaflet
                    facilities={facilities}
                    selected={selected}
                    onSelect={setSelected}
                    userLocation={userLocation}
                    activeHazards={[]}
                />
            </div>

            {/* ── Top bar (above the feed panel so its actions stay clickable) ── */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] flex items-start justify-between gap-3 p-3 sm:p-4">
                {/* Left: BetterIligan branding + page context + status */}
                <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white/95 px-2.5 py-2 shadow-md backdrop-blur sm:gap-3 sm:px-3">
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
                    <span className="h-6 w-px bg-slate-200" aria-hidden />
                    <span className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900">Bangon Iligan</span>
                    <StatusPill active={active} label={active ? 'Active' : 'Standby'} />
                </div>

                {/* Right: actions */}
                <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
                    <Link
                        href={config.standby.preparednessHref}
                        className="hidden items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-sm font-bold text-slate-700 shadow-md backdrop-blur transition-colors hover:bg-white sm:inline-flex"
                    >
                        <ShieldAlert className="h-4 w-4" /> Get prepared
                    </Link>
                    {config.hazardReportsEnabled && <HazardReportModal />}
                </div>
            </div>

            {/* ── Standby message ribbon (dismissible, session-persisted) ── */}
            {!active && !standbyDismissed && (
                <div className="pointer-events-none absolute inset-x-0 top-16 z-[550] flex justify-center px-3 sm:top-20">
                    <div className="pointer-events-auto flex max-w-2xl items-start gap-2 rounded-xl bg-emerald-900/85 py-2 pl-4 pr-2 text-xs text-emerald-50 shadow-lg backdrop-blur sm:text-sm">
                        <p className="py-0.5 text-center">{config.standby.message}</p>
                        <button
                            onClick={dismissStandby}
                            aria-label="Dismiss notice"
                            className="shrink-0 rounded-md p-1 text-emerald-200 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Map controls (bottom-left) ── */}
            <div className="pointer-events-none absolute bottom-4 left-3 z-[600] flex flex-col gap-2 sm:left-4">
                <button
                    onClick={locateMe}
                    disabled={locating}
                    aria-label="Find my location"
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                    {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
                </button>
                <Link
                    href="/disaster"
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-700"
                >
                    <Phone className="h-4 w-4" /> Hotlines
                </Link>
            </div>

            {/* ── Live feed panel toggle (when closed) ── */}
            {!panelOpen && (
                <button
                    onClick={() => setPanelOpen(true)}
                    className="pointer-events-auto absolute bottom-4 right-3 z-[600] inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-slate-800 sm:right-4"
                >
                    <MessageSquare className="h-4 w-4" /> Live feed
                </button>
            )}

            {/* ── Live feed floating panel ──
                Wrapper is pointer-events-none so its transparent top spacer never
                blocks the top-bar actions; only the card itself is interactive. */}
            <div
                className={`pointer-events-none absolute right-0 top-0 z-[650] flex h-[100dvh] w-full flex-col p-3 transition-transform duration-300 sm:w-[380px] sm:p-4 ${panelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Spacer clears the top bar */}
                <div className="h-14 shrink-0 sm:h-16" />
                <div className="pointer-events-auto relative flex min-h-0 flex-1 flex-col">
                    <BangonLivePanel
                        feed={feed}
                        reports={reports}
                        messages={messages}
                        pendingReports={pendingReports}
                        pendingMessages={pendingMessages}
                        isAdmin={isAdmin}
                        boardEnabled={config.boardEnabled}
                    />
                    <button
                        onClick={() => setPanelOpen(false)}
                        className="mt-2 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white/90 py-1.5 text-xs font-bold text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-slate-800"
                    >
                        <X className="h-3.5 w-3.5" /> Hide panel
                    </button>
                </div>
            </div>

            {/* ── Selected facility detail card ── */}
            {selected && (
                <FacilityCard facility={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}

function StatusPill({ active, label }: { active: boolean; label: string }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${active ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}
        >
            {active ? <Siren className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
            {label}
        </span>
    );
}

function FacilityCard({ facility, onClose }: { facility: DisasterFacility; onClose: () => void }) {
    const { label, color } = CATEGORY_META[facility.category];
    return (
        <div className="pointer-events-auto absolute bottom-4 left-1/2 z-[700] w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-white p-4 shadow-2xl sm:left-4 sm:translate-x-0">
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
            >
                <X className="h-4 w-4" />
            </button>
            <span
                className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: color }}
            >
                {label}
            </span>
            <h3 className="mt-1.5 pr-6 text-base font-bold leading-tight text-slate-900">{facility.name}</h3>
            {facility.address && (
                <p className="mt-0.5 flex items-start gap-1 text-sm text-slate-500">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {facility.address}
                </p>
            )}
            <div className="mt-3 flex gap-2">
                {facility.tel && (
                    <a
                        href={telHref(facility.tel)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                        <Phone className="h-4 w-4" /> Call
                    </a>
                )}
                <a
                    href={`https://www.openstreetmap.org/directions?to=${facility.lat}%2C${facility.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
                >
                    <Navigation className="h-4 w-4" /> Directions
                </a>
            </div>
        </div>
    );
}
