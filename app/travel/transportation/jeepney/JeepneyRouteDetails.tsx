'use client'

import Image from 'next/image';
import {
    Banknote, Clock, GraduationCap,
    MapPin, Route, X,
} from 'lucide-react';

type JeepneyFare = {
    regular: number;
    discounted: number;
};

type JeepneyCodeEntry = {
    routeId: string;
    routeCode: string;
    routeColor?: string;

    routeFare?: JeepneyFare;

    image?: string;
    places?: string[];

    description?: string;
    operatingHours?: string;
    estimatedTravelTime?: string;
};

interface JeepneyRouteDetailsProps {
    route: {
        routeId: string;
        routeCode: string;
        name: string;
        routeColor?: string;
        routeFare?: JeepneyFare;
        hasGeoJson: boolean;
    } | null;

    codeEntry?: JeepneyCodeEntry;

    getRouteColor: (
        routeId: string,
        fallbackStroke?: string
    ) => string;

    onClose: () => void;
}

export default function JeepneyRouteDetails({
    route,
    codeEntry,
    getRouteColor,
    onClose,
}: JeepneyRouteDetailsProps) {

    if (!route) return null;

    const routeColor = getRouteColor(
        route.routeId,
        route.routeColor
    );

    const image = codeEntry?.image;
    const places = codeEntry?.places ?? [];
    const fare = codeEntry?.routeFare ?? route.routeFare;

    return (
        <aside
            className="
                absolute top-4 right-4 z-[1000]
                w-80
                max-h-[calc(100dvh-5.75rem)]
                overflow-hidden
                bg-white
                border border-slate-200
                rounded-2xl
                shadow-2xl
                flex flex-col
                animate-in
                slide-in-from-right-8
                duration-300
            "
        >
            {/* Header */}
            <div className="relative shrink-0">

                {/* Route Image */}
                {image ? (
                    <div className="relative h-44 w-full">
                        <Image
                            src={image}
                            alt={route.name}
                            fill
                            className="object-cover"
                            sizes="320px"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                    </div>
                ) : (
                    <div
                        className="h-32 w-full flex items-center justify-center"
                        style={{
                            backgroundColor: routeColor,
                        }}
                    >
                        <Route className="w-12 h-12 text-white/70" />
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close route details"
                    className="
                        absolute top-3 right-3
                        p-2
                        rounded-full
                        bg-black/40
                        text-white
                        backdrop-blur-sm
                        hover:bg-black/60
                        transition-colors
                    "
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto custom-scrollbar">

                <div className="p-5">

                    {/* Route title */}
                    <div className="flex items-start gap-3">

                        <div
                            className="
                                w-11 h-11
                                rounded-xl
                                flex items-center justify-center
                                shrink-0
                                text-white
                                text-xs
                                font-extrabold
                                shadow-sm
                                px-1
                                text-center
                                leading-none
                            "
                            style={{
                                backgroundColor: routeColor,
                            }}
                        >
                            {route.routeCode}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                                {route.name}
                            </h2>

                            <div
                                className="text-xs font-bold tracking-wider uppercase mt-1"
                                style={{
                                    color: routeColor,
                                }}
                            >
                                Route {route.routeId}
                            </div>
                        </div>
                    </div>

                    {/* Map availability */}
                    <div
                        className={`
                            mt-4
                            flex items-center gap-2
                            px-3 py-2.5
                            rounded-xl
                            border
                            text-xs font-semibold
                            ${route.hasGeoJson
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-amber-50 border-amber-100 text-amber-700'
                            }
                        `}
                    >
                        <span
                            className={`
                                w-2 h-2 rounded-full shrink-0
                                ${route.hasGeoJson
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }
                            `}
                        />

                        {route.hasGeoJson
                            ? 'Route map available'
                            : 'Route map not yet available'}
                    </div>

                    {/* Places */}
                    {places.length > 0 && (
                        <section className="mt-5">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-slate-500" />

                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Places Along This Route
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {places.map((place) => (
                                    <span
                                        key={place}
                                        className="
                                            px-2.5 py-1.5
                                            rounded-lg
                                            bg-slate-100
                                            text-slate-700
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        {place}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Description */}
                    {codeEntry?.description && (
                        <section className="mt-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                About This Route
                            </h3>

                            <p className="text-sm leading-relaxed text-slate-600">
                                {codeEntry.description}
                            </p>
                        </section>
                    )}

                    {/* Route information */}
                    {(codeEntry?.operatingHours ||
                        codeEntry?.estimatedTravelTime) && (
                            <section className="mt-5 grid grid-cols-2 gap-2">

                                {codeEntry.operatingHours && (
                                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <Clock className="w-3.5 h-3.5" />

                                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                                Operating Hours
                                            </span>
                                        </div>

                                        <p className="text-xs font-bold text-slate-800">
                                            {codeEntry.operatingHours}
                                        </p>
                                    </div>
                                )}

                                {codeEntry.estimatedTravelTime && (
                                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <Route className="w-3.5 h-3.5" />

                                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                                Travel Time
                                            </span>
                                        </div>

                                        <p className="text-xs font-bold text-slate-800">
                                            {codeEntry.estimatedTravelTime}
                                        </p>
                                    </div>
                                )}
                            </section>
                        )}

                    {/* Fare */}
                    {fare && (
                        <section className="mt-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                Fare
                            </h3>

                            <div className="grid grid-cols-2 gap-2">

                                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1.5 text-emerald-700">
                                        <Banknote className="w-3.5 h-3.5" />

                                        <span className="text-[9px] font-bold uppercase tracking-wide">
                                            Regular
                                        </span>
                                    </div>

                                    <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                                        ₱{fare.regular}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1.5 text-indigo-700">
                                        <GraduationCap className="w-3.5 h-3.5" />

                                        <span className="text-[9px] font-bold uppercase tracking-wide">
                                            Student / PWD
                                        </span>
                                    </div>

                                    <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                                        ₱{fare.discounted}
                                    </div>
                                </div>

                            </div>
                        </section>
                    )}

                </div>
            </div>
        </aside>
    );
}
