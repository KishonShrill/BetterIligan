"use client";

import React, { useState } from "react";
import { Ticket, X, Users, Wind, MapPin, ArrowDownUp } from "lucide-react";
import { calculateLTFRBFare } from "@/utils/fareCalculator";
import busFaresData from "@/data/travel/bus-fares.json";

interface FareCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// A linear mapping of stops and their distance from CDO (Km 0)
// You can easily add more stops here from the JSON list later!
const BUS_STOPS = [
  { id: "cdo", name: "Cagayan de Oro (Westbound)", kmFromCdo: 0 },
  ...busFaresData.routes.westbound_terminal_to.map((stop) => ({
    id: stop.destination.toLowerCase().replace(/\s+/g, "-"),
    name: stop.destination
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    kmFromCdo: stop.km,
  })),
  { id: "marawi-city", name: "Marawi City", kmFromCdo: 122 },
];

export default function FareCalculatorModal({
  isOpen,
  onClose,
}: FareCalculatorModalProps) {
  const [origin, setOrigin] = useState(BUS_STOPS[0].id);
  const [destination, setDestination] = useState(BUS_STOPS[3].id);

  const [isDiscounted, setIsDiscounted] = useState(false); // 20% off for Student/Senior/PWD
  const [isAircon, setIsAircon] = useState(true);

  if (!isOpen) return null;

  // --- DISTANCE & FARE CALCULATION ---
  const originStop = BUS_STOPS.find((s) => s.id === origin);
  const destStop = BUS_STOPS.find((s) => s.id === destination);

  // Math.abs turns negative numbers positive, so order doesn't matter (e.g., Iligan(85) - CDO(0) = 85km)
  const distance =
    originStop && destStop
      ? Math.abs(originStop.kmFromCdo - destStop.kmFromCdo)
      : 0;

  // Calculate base non-aircon fare using our LTFRB helper
  const baseCalculatedFare = calculateLTFRBFare(distance, isDiscounted);

  // Add approx 20% premium for Aircon buses
  const calculatedFare = isAircon
    ? baseCalculatedFare * 1.2
    : baseCalculatedFare;

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-500/20 p-2">
              <Ticket className="h-6 w-6 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold">Fare Estimator</h2>
            <p className="rounded-lg bg-orange-500 p-1 text-sm font-semibold text-white">
              BETA
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-6 p-6">
          {/* Dynamic From/To Selection */}
          <div className="relative space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {/* FROM Input */}
            <div className="space-y-1.5">
              <label className="pl-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 font-medium text-slate-700 transition-all outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                >
                  {BUS_STOPS.map((stop) => (
                    <option
                      key={`from-${stop.id}`}
                      value={stop.id}
                      disabled={stop.id === destination}
                    >
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button (Absolute positioned in the middle) */}
            <div className="absolute top-[calc(50%+0.75rem)] right-0 z-10 -translate-y-1/2">
              <button
                onClick={handleSwap}
                className="rounded-full border border-slate-200 bg-blue-500 p-3 text-white shadow-sm transition-colors hover:bg-slate-50 hover:text-rose-600"
                title="Swap locations"
              >
                <ArrowDownUp className="h-6 w-6" />
              </button>
            </div>

            {/* TO Input */}
            <div className="space-y-1.5">
              <label className="pl-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-rose-500" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 font-medium text-slate-700 transition-all outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                >
                  {BUS_STOPS.map((stop) => (
                    <option
                      key={`to-${stop.id}`}
                      value={stop.id}
                      disabled={stop.id === origin}
                    >
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {/* Aircon Toggle */}
            <button
              onClick={() => setIsAircon(!isAircon)}
              className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-colors ${
                isAircon
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Wind className="mb-1.5 h-5 w-5" />
              <span className="text-center text-xs font-bold">
                Airconditioned
              </span>
            </button>

            {/* Discount Toggle */}
            <button
              onClick={() => setIsDiscounted(!isDiscounted)}
              className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-colors ${
                isDiscounted
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Users className="mb-1.5 h-5 w-5" />
              <span className="text-center text-xs font-bold">
                Student / Senior
              </span>
            </button>
          </div>

          {/* Price Result */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="mb-2 text-sm font-bold tracking-wider text-slate-500 uppercase">
              Estimated Fare
            </p>

            {distance === 0 ? (
              <div className="py-2 text-3xl font-black tracking-tight text-slate-300">
                Select Destination
              </div>
            ) : (
              <div className="flex items-start justify-center gap-1 text-5xl font-black tracking-tight text-slate-900">
                <span className="mt-1 text-2xl text-slate-400">₱</span>
                {calculatedFare.toFixed(2)}
              </div>
            )}

            {isDiscounted && distance > 0 && (
              <p className="mx-auto mt-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600">
                20% Discount Applied
              </p>
            )}

            {/* Subtle Distance Indicator */}
            {distance > 0 && (
              <div className="absolute top-3 right-4 text-xs font-bold text-slate-400">
                {distance} km trip
              </div>
            )}
          </div>

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            Note: These are estimated fares based on standard Rural Transit
            Mindanao Inc. rates. Actual fares may vary slightly at the terminal.
          </p>
        </div>
      </div>
    </div>
  );
}
