"use client";

import Image from "next/image";
import { Banknote, Clock, GraduationCap, MapPin, Route, X } from "lucide-react";
import type { JeepneyFare, JeepneyCodeEntry } from "./types";

interface JeepneyRouteDetailsProps {
  route: {
    routeId: string;
    name: string;
    routeColor?: string;
    routeFare?: JeepneyFare;
    hasGeoJson: boolean;
  } | null;

  codeEntry?: JeepneyCodeEntry;

  getRouteColor: (routeId: string, fallbackStroke?: string) => string;

  onClose: () => void;
}

export default function JeepneyRouteDetails({
  route,
  codeEntry,
  getRouteColor,
  onClose,
}: JeepneyRouteDetailsProps) {
  if (!route) return null;

  const routeColor = getRouteColor(route.routeId, route.routeColor);

  const image = codeEntry?.image;
  const places = codeEntry?.places ?? [];
  const fare = codeEntry?.routeFare ?? route.routeFare;

  return (
    <aside className="animate-in slide-in-from-right-8 absolute top-4 right-4 z-[1000] flex max-h-[calc(100dvh-5.75rem)] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-300">
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
            className="flex h-32 w-full items-center justify-center"
            style={{
              backgroundColor: routeColor,
            }}
          >
            <Route className="h-12 w-12 text-white/70" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close route details"
          className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="custom-scrollbar overflow-y-auto">
        <div className="p-5">
          {/* Route title */}
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl px-1 text-center text-xs leading-none font-extrabold text-white shadow-sm"
              style={{
                backgroundColor: routeColor,
              }}
            >
              {route.routeId}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg leading-tight font-extrabold text-slate-900">
                {route.name}
              </h2>

              <div
                className="mt-1 text-xs font-bold tracking-wider uppercase"
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
            className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold ${
              route.hasGeoJson
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-amber-100 bg-amber-50 text-amber-700"
            } `}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                route.hasGeoJson ? "bg-emerald-500" : "bg-amber-500"
              } `}
            />

            {route.hasGeoJson
              ? "Route map available"
              : "Route map not yet available"}
          </div>

          {/* Places */}
          {places.length > 0 && (
            <section className="mt-5">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />

                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Places Along This Route
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {places.map((place) => (
                  <span
                    key={place}
                    className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
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
              <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                About This Route
              </h3>

              <p className="text-sm leading-relaxed text-slate-600">
                {codeEntry.description}
              </p>
            </section>
          )}

          {/* Route information */}
          {(codeEntry?.operatingHours || codeEntry?.estimatedTravelTime) && (
            <section className="mt-5 grid grid-cols-2 gap-2">
              {codeEntry.operatingHours && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold tracking-wide uppercase">
                      Operating Hours
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    {codeEntry.operatingHours}
                  </p>
                </div>
              )}

              {codeEntry.estimatedTravelTime && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                    <Route className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold tracking-wide uppercase">
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
              <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Fare
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Banknote className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold tracking-wide uppercase">
                      Regular
                    </span>
                  </div>

                  <div className="mt-0.5 text-lg font-extrabold text-slate-900">
                    ₱{fare.regular}
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <GraduationCap className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold tracking-wide uppercase">
                      Student / PWD
                    </span>
                  </div>

                  <div className="mt-0.5 text-lg font-extrabold text-slate-900">
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
