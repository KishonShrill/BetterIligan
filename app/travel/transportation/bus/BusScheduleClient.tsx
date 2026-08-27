'use client'

import { useState, useEffect } from 'react';
import { MapPin, ArrowRightLeft, Clock, Info, Calculator, Ticket } from 'lucide-react';
import ruralTransitData from '@/data/travel/ruralTransitSchedules.json';
import FareCalculatorModal from '@/components/modals/FareCalculatorModal';

type BusCompany = 'Rural Transit' | 'Super 5';
type Route = 'CDO-Iligan' | 'CDO-Marawi';
type Direction = 'forward' | 'reverse';
type FilterType = 'All' | 'Non-Stop' | '3-Stop';

export default function BusScheduleClient() {
    const [company, setCompany] = useState<BusCompany>('Rural Transit');
    const [route, setRoute] = useState<Route>('CDO-Iligan');
    const [direction, setDirection] = useState<Direction>('forward');
    const [filter, setFilter] = useState<FilterType>('All');

    // Time Tracking
    const [currentMinutes, setCurrentMinutes] = useState<number>(-1);
    const [isFareModalOpen, setIsFareModalOpen] = useState(false);

    // --- TIME TRACKER (Hydration Safe) ---
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // --- HELPERS ---
    const toggleDirection = () => {
        setDirection(prev => prev === 'forward' ? 'reverse' : 'forward');
    };

    const hasDeparted = (timeStr: string) => {
        if (currentMinutes === -1) return false;

        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const tripMinutes = hours * 60 + minutes;
        return tripMinutes < currentMinutes;
    };

    const getCdoIliganData = () => {
        const raw = direction === 'forward'
            ? ruralTransitData.cdo_iligan.cdo_to_iligan
            : ruralTransitData.cdo_iligan.iligan_to_cdo;

        if (filter === 'All') return raw;
        return raw.filter(trip => trip.type === filter);
    };

    const getCdoMarawiData = () => {
        return direction === 'forward'
            ? ruralTransitData.cdo_marawi.cdo_to_marawi
            : ruralTransitData.cdo_marawi.marawi_to_cdo;
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Main Layout Container */}
            <div className="max-w-404 mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-9 space-y-8">

                        {/* Company Tabs */}
                        <div className="flex p-1 bg-slate-200/60 rounded-xl w-fit mx-auto lg:mx-0">
                            {(['Rural Transit', 'Super 5'] as BusCompany[]).map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCompany(c)}
                                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${company === c
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {company === 'Super 5' ? (
                            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                                Super 5 schedules are currently being updated. Check back soon!
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* Route & Direction Controls */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-6 mb-6">

                                        {/* Route Tabs */}
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => setRoute('CDO-Iligan')}
                                                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-xl border transition-all ${route === 'CDO-Iligan'
                                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                Iligan ↔ CDO
                                            </button>
                                            <button
                                                onClick={() => setRoute('CDO-Marawi')}
                                                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-xl border transition-all ${route === 'CDO-Marawi'
                                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                CDO ↔ Marawi
                                            </button>
                                        </div>

                                        {/* Direction Swapper */}
                                        <button
                                            onClick={toggleDirection}
                                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors shadow-sm"
                                        >
                                            <MapPin className="w-4 h-4 text-rose-400" />
                                            <span className="min-w-35 text-center">
                                                {route === 'CDO-Iligan'
                                                    ? (direction === 'forward' ? 'CDO to Iligan' : 'Iligan to CDO')
                                                    : (direction === 'forward' ? 'CDO to Marawi' : 'Marawi to CDO')
                                                }
                                            </span>
                                            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>

                                    {/* --- HIGH FREQUENCY ROUTE (CDO ↔ ILIGAN) --- */}
                                    {route === 'CDO-Iligan' && (
                                        <div className="animate-in fade-in duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">Daily Departures</h3>
                                                    <p className="text-sm text-slate-500">Buses depart roughly every 20-30 minutes.</p>
                                                </div>

                                                {/* Service Type Filter */}
                                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                                    {(['All', 'Non-Stop', '3-Stop'] as FilterType[]).map(f => (
                                                        <button
                                                            key={f}
                                                            onClick={() => setFilter(f)}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === f
                                                                ? 'bg-white text-slate-900 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {getCdoIliganData().map((trip, idx) => {
                                                    const isPast = hasDeparted(trip.time);

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-xl border flex flex-col justify-center items-center text-center transition-colors ${isPast
                                                                ? 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                                                                : trip.type === 'Non-Stop'
                                                                    ? 'bg-emerald-50 border-emerald-100'
                                                                    : 'bg-white border-slate-200'
                                                                }`}
                                                        >
                                                            <div className={`text-lg font-black tracking-tight ${isPast ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                                {trip.time}
                                                            </div>
                                                            <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded ${isPast
                                                                ? 'bg-slate-200 text-slate-500'
                                                                : trip.type === 'Non-Stop'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {isPast ? 'Departed' : trip.type}
                                                            </div>

                                                            {trip.remarks && (
                                                                <div className={`text-[9px] mt-1.5 leading-tight font-medium ${isPast ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                    {trip.remarks}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- LOW FREQUENCY ROUTE (CDO ↔ MARAWI) --- */}
                                    {route === 'CDO-Marawi' && (
                                        <div className="animate-in fade-in duration-300">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-slate-900">Limited Daily Trips</h3>
                                                <p className="text-sm text-slate-500">Please arrive at the terminal early to secure a seat.</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {getCdoMarawiData().map((trip, idx) => {
                                                    const isPast = hasDeparted(trip.time);

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all ${isPast
                                                                ? 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                                                                : 'bg-linear-to-br from-white to-slate-50 border-slate-200'
                                                                }`}
                                                        >
                                                            <div>
                                                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${isPast ? 'text-slate-400' : 'text-rose-500'}`}>
                                                                    {isPast ? 'Departed' : trip.label}
                                                                </span>
                                                                <div className={`text-3xl font-black tracking-tight ${isPast ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                                    {trip.time}
                                                                </div>
                                                            </div>
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPast ? 'bg-slate-200' : 'bg-rose-50'}`}>
                                                                <Clock className={`w-6 h-6 ${isPast ? 'text-slate-400' : 'text-rose-600'}`} />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
                                        <Info className="w-5 h-5 shrink-0" />
                                        <p>Schedule effective as of March 1, 2026. Trip availability is subject to passenger volume.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT SIDE: UTILITY SIDEBAR (4 Columns) --- */}
                    <div className="lg:col-span-3 lg:mt-20 lg:sticky lg:top-24 max-lg:mx-auto w-full">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6">

                            {/* Utility Header */}
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                                <Calculator className="w-5 h-5 text-slate-400" />
                                <h3 className="font-bold text-slate-900">Utility Tools</h3>
                            </div>

                            {/* Utility Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Fare Calculator Button (Opens Modal) */}
                                <button
                                    onClick={() => setIsFareModalOpen(true)}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                                >
                                    <Ticket className="w-6 h-6 text-rose-500 mb-2" />
                                    <span className="text-xs font-bold text-slate-700 text-center">Fare Calculator</span>
                                </button>

                                {/* Placeholder */}
                                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed">
                                    <span className="text-xs font-medium text-slate-500 text-center">More Tools Soon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <FareCalculatorModal
                isOpen={isFareModalOpen}
                onClose={() => setIsFareModalOpen(false)}
            />
        </main>
    );
}
