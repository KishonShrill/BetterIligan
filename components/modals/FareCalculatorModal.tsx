'use client'

import React, { useState } from 'react';
import { Ticket, X, Users, Wind, MapPin, ArrowDownUp } from 'lucide-react';
import { calculateLTFRBFare } from '@/utils/fareCalculator';
import busFaresData from '@/data/travel/bus-fares.json';

interface FareCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// A linear mapping of stops and their distance from CDO (Km 0)
// You can easily add more stops here from the JSON list later!
const BUS_STOPS = [
    { id: 'cdo', name: 'Cagayan de Oro (Westbound)', kmFromCdo: 0 },
    ...busFaresData.routes.westbound_terminal_to.map(stop => ({
        id: stop.destination.toLowerCase().replace(/\s+/g, '-'),
        name: stop.destination.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
        kmFromCdo: stop.km
    })),
    { id: 'marawi-city', name: 'Marawi City', kmFromCdo: 122 },
];

export default function FareCalculatorModal({ isOpen, onClose }: FareCalculatorModalProps) {
    const [origin, setOrigin] = useState(BUS_STOPS[0].id);
    const [destination, setDestination] = useState(BUS_STOPS[3].id);

    const [isDiscounted, setIsDiscounted] = useState(false); // 20% off for Student/Senior/PWD
    const [isAircon, setIsAircon] = useState(true);

    if (!isOpen) return null;

    // --- DISTANCE & FARE CALCULATION ---
    const originStop = BUS_STOPS.find(s => s.id === origin);
    const destStop = BUS_STOPS.find(s => s.id === destination);

    // Math.abs turns negative numbers positive, so order doesn't matter (e.g., Iligan(85) - CDO(0) = 85km)
    const distance = originStop && destStop ? Math.abs(originStop.kmFromCdo - destStop.kmFromCdo) : 0;

    // Calculate base non-aircon fare using our LTFRB helper
    const baseCalculatedFare = calculateLTFRBFare(distance, isDiscounted);

    // Add approx 20% premium for Aircon buses
    const calculatedFare = isAircon ? baseCalculatedFare * 1.2 : baseCalculatedFare;

    const handleSwap = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/20 rounded-lg">
                            <Ticket className="w-6 h-6 text-rose-400" />
                        </div>
                        <h2 className="text-xl font-bold">Fare Estimator</h2>
                        <p className='p-1 text-sm font-semibold bg-orange-500 text-white rounded-lg'>BETA</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">

                    {/* Dynamic From/To Selection */}
                    <div className="relative space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">

                        {/* FROM Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">From</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-700 appearance-none"
                                >
                                    {BUS_STOPS.map(stop => (
                                        <option key={`from-${stop.id}`} value={stop.id} disabled={stop.id === destination}>
                                            {stop.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Swap Button (Absolute positioned in the middle) */}
                        <div className="absolute right-0 top-[calc(50%+0.75rem)] -translate-y-1/2 z-10">
                            <button
                                onClick={handleSwap}
                                className="p-3 bg-blue-500 border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:text-rose-600 transition-colors text-white"
                                title="Swap locations"
                            >
                                <ArrowDownUp className="w-6 h-6" />
                            </button>
                        </div>

                        {/* TO Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">To</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-700 appearance-none"
                                >
                                    {BUS_STOPS.map(stop => (
                                        <option key={`to-${stop.id}`} value={stop.id} disabled={stop.id === origin}>
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
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${isAircon ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <Wind className="w-5 h-5 mb-1.5" />
                            <span className="text-xs font-bold text-center">Airconditioned</span>
                        </button>

                        {/* Discount Toggle */}
                        <button
                            onClick={() => setIsDiscounted(!isDiscounted)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${isDiscounted ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <Users className="w-5 h-5 mb-1.5" />
                            <span className="text-xs font-bold text-center">Student / Senior</span>
                        </button>
                    </div>

                    {/* Price Result */}
                    <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200 relative overflow-hidden">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Estimated Fare</p>

                        {distance === 0 ? (
                            <div className="text-3xl font-black text-slate-300 tracking-tight py-2">
                                Select Destination
                            </div>
                        ) : (
                            <div className="text-5xl font-black text-slate-900 tracking-tight flex items-start justify-center gap-1">
                                <span className="text-2xl mt-1 text-slate-400">₱</span>
                                {calculatedFare.toFixed(2)}
                            </div>
                        )}

                        {isDiscounted && distance > 0 && (
                            <p className="text-[10px] font-bold text-emerald-600 mt-3 bg-emerald-100 px-3 py-1 rounded-full w-fit mx-auto">
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

                    <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                        Note: These are estimated fares based on standard Rural Transit Mindanao Inc. rates. Actual fares may vary slightly at the terminal.
                    </p>
                </div>
            </div>
        </div>
    );
}
