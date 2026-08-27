"use client";

import { useState, useEffect } from "react";
import {
    MapPin,
    ArrowRightLeft,
    Clock,
    Info,
    Calculator,
    Ticket,
} from "lucide-react";
import ruralTransitData from "@/data/travel/ruralTransitSchedules.json";
import FareCalculatorModal from "@/components/modals/FareCalculatorModal";

type BusCompany = "Rural Transit" | "Super 5";
type Route = "CDO-Iligan" | "CDO-Marawi";
type Direction = "forward" | "reverse";
type FilterType = "All" | "Non-Stop" | "3-Stop";

export default function BusScheduleClient() {
    const [company, setCompany] = useState<BusCompany>("Rural Transit");
    const [route, setRoute] = useState<Route>("CDO-Iligan");
    const [direction, setDirection] = useState<Direction>("forward");
    const [filter, setFilter] = useState<FilterType>("All");

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
        setDirection((prev) => (prev === "forward" ? "reverse" : "forward"));
    };

    const hasDeparted = (timeStr: string) => {
        if (currentMinutes === -1) return false;

        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const tripMinutes = hours * 60 + minutes;
        return tripMinutes < currentMinutes;
    };

    const getCdoIliganData = () => {
        const raw =
            direction === "forward"
                ? ruralTransitData.cdo_iligan.cdo_to_iligan
                : ruralTransitData.cdo_iligan.iligan_to_cdo;

        if (filter === "All") return raw;
        return raw.filter((trip) => trip.type === filter);
    };

    const getCdoMarawiData = () => {
        return direction === "forward"
            ? ruralTransitData.cdo_marawi.cdo_to_marawi
            : ruralTransitData.cdo_marawi.marawi_to_cdo;
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Main Layout Container */}
            <div className="mx-auto max-w-404 px-4 py-6 md:px-6 md:py-12">
                <div className="flex flex-col-reverse items-start gap-8 lg:grid lg:grid-cols-12">
                    <div className="space-y-8 lg:col-span-9">
                        {/* Company Tabs */}
                        <div className="mx-auto flex w-fit rounded-xl bg-slate-200/60 p-1 lg:mx-0">
                            {(["Rural Transit", "Super 5"] as BusCompany[]).map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCompany(c)}
                                    className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${company === c
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {company === "Super 5" ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                                Super 5 schedules are currently being updated. Check back soon!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Route & Direction Controls */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                                    <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row">
                                        {/* Route Tabs */}
                                        <div className="flex w-full gap-2 sm:w-auto">
                                            <button
                                                onClick={() => setRoute("CDO-Iligan")}
                                                className={`flex-1 rounded-xl border px-4 py-2 text-sm font-bold transition-all sm:flex-none ${route === "CDO-Iligan"
                                                        ? "border-rose-200 bg-rose-50 text-rose-700"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                Iligan ↔ CDO
                                            </button>
                                            <button
                                                onClick={() => setRoute("CDO-Marawi")}
                                                className={`flex-1 rounded-xl border px-4 py-2 text-sm font-bold transition-all sm:flex-none ${route === "CDO-Marawi"
                                                        ? "border-rose-200 bg-rose-50 text-rose-700"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                CDO ↔ Marawi
                                            </button>
                                        </div>

                                        {/* Direction Swapper */}
                                        <button
                                            onClick={toggleDirection}
                                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
                                        >
                                            <MapPin className="h-4 w-4 text-rose-400" />
                                            <span className="min-w-35 text-center">
                                                {route === "CDO-Iligan"
                                                    ? direction === "forward"
                                                        ? "CDO to Iligan"
                                                        : "Iligan to CDO"
                                                    : direction === "forward"
                                                        ? "CDO to Marawi"
                                                        : "Marawi to CDO"}
                                            </span>
                                            <ArrowRightLeft className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </div>

                                    {/* --- HIGH FREQUENCY ROUTE (CDO ↔ ILIGAN) --- */}
                                    {route === "CDO-Iligan" && (
                                        <div className="animate-in fade-in duration-300">
                                            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        Daily Departures
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        Buses depart roughly every 20-30 minutes.
                                                    </p>
                                                </div>

                                                {/* Service Type Filter */}
                                                <div className="flex rounded-lg bg-slate-100 p-1">
                                                    {(["All", "Non-Stop", "3-Stop"] as FilterType[]).map(
                                                        (f) => (
                                                            <button
                                                                key={f}
                                                                onClick={() => setFilter(f)}
                                                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${filter === f
                                                                        ? "bg-white text-slate-900 shadow-sm"
                                                                        : "text-slate-500 hover:text-slate-700"
                                                                    }`}
                                                            >
                                                                {f}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                                {getCdoIliganData().map((trip, idx) => {
                                                    const isPast = hasDeparted(trip.time);

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors ${isPast
                                                                    ? "border-slate-200 bg-slate-50 opacity-60 grayscale"
                                                                    : trip.type === "Non-Stop"
                                                                        ? "border-emerald-100 bg-emerald-50"
                                                                        : "border-slate-200 bg-white"
                                                                }`}
                                                        >
                                                            <div
                                                                className={`text-lg font-black tracking-tight ${isPast ? "text-slate-400 line-through" : "text-slate-800"}`}
                                                            >
                                                                {trip.time}
                                                            </div>
                                                            <div
                                                                className={`mt-1 rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${isPast
                                                                        ? "bg-slate-200 text-slate-500"
                                                                        : trip.type === "Non-Stop"
                                                                            ? "bg-emerald-100 text-emerald-700"
                                                                            : "bg-slate-100 text-slate-500"
                                                                    }`}
                                                            >
                                                                {isPast ? "Departed" : trip.type}
                                                            </div>

                                                            {trip.remarks && (
                                                                <div
                                                                    className={`mt-1.5 text-[9px] leading-tight font-medium ${isPast ? "text-slate-400" : "text-slate-500"}`}
                                                                >
                                                                    {trip.remarks}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- LOW FREQUENCY ROUTE (CDO ↔ MARAWI) --- */}
                                    {route === "CDO-Marawi" && (
                                        <div className="animate-in fade-in duration-300">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Limited Daily Trips
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Please arrive at the terminal early to secure a seat.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {getCdoMarawiData().map((trip, idx) => {
                                                    const isPast = hasDeparted(trip.time);

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center justify-between rounded-2xl border p-6 shadow-sm transition-all ${isPast
                                                                    ? "border-slate-200 bg-slate-50 opacity-60 grayscale"
                                                                    : "border-slate-200 bg-linear-to-br from-white to-slate-50"
                                                                }`}
                                                        >
                                                            <div>
                                                                <span
                                                                    className={`mb-1 block text-xs font-bold tracking-wider uppercase ${isPast ? "text-slate-400" : "text-rose-500"}`}
                                                                >
                                                                    {isPast ? "Departed" : trip.label}
                                                                </span>
                                                                <div
                                                                    className={`text-3xl font-black tracking-tight ${isPast ? "text-slate-400 line-through" : "text-slate-800"}`}
                                                                >
                                                                    {trip.time}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`flex h-12 w-12 items-center justify-center rounded-full ${isPast ? "bg-slate-200" : "bg-rose-50"}`}
                                                            >
                                                                <Clock
                                                                    className={`h-6 w-6 ${isPast ? "text-slate-400" : "text-rose-600"}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                                        <Info className="h-5 w-5 shrink-0" />
                                        <p>
                                            Schedule effective as of March 1, 2026. Trip availability
                                            is subject to passenger volume.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT SIDE: UTILITY SIDEBAR (4 Columns) --- */}
                    <div className="w-full max-lg:mx-auto lg:sticky lg:top-24 lg:col-span-3 lg:mt-20">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {/* Utility Header */}
                            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <Calculator className="h-5 w-5 text-slate-400" />
                                <h3 className="font-bold text-slate-900">Utility Tools</h3>
                            </div>

                            {/* Utility Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Fare Calculator Button (Opens Modal) */}
                                <button
                                    onClick={() => setIsFareModalOpen(true)}
                                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-rose-300 hover:bg-rose-50"
                                >
                                    <Ticket className="mb-2 h-6 w-6 text-rose-500" />
                                    <span className="text-center text-xs font-bold text-slate-700">
                                        Fare Calculator
                                    </span>
                                </button>

                                {/* Placeholder */}
                                <div className="flex cursor-not-allowed flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-50">
                                    <span className="text-center text-xs font-medium text-slate-500">
                                        More Tools Soon
                                    </span>
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
