"use client";

import { useState } from "react";
import Link from "next/link";
import { Server, X } from "lucide-react";

const WeatherStatusBadge = ({
  isFallback,
  weatherData,
}: {
  isFallback: boolean;
  weatherData: any;
}) => {
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  // Crucial: We use stopPropagation so clicking this badge doesn't
  // accidentally trigger the massive main Weather modal behind it.
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSourceModalOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSourceModalOpen(false);
  };

  return (
    <>
      {/* BADGE BUTTON */}
      {isFallback ? (
        <button
          onClick={handleOpen}
          className="cursor-help rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-950 uppercase transition-colors hover:bg-amber-300"
        >
          Offline
        </button>
      ) : (
        <button
          onClick={handleOpen}
          className="flex cursor-help items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <div className="flex items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full ${weatherData.sources?.open_weather ? "bg-emerald-400" : "bg-rose-400"}`}
            />
            <div
              className={`h-2 w-2 rounded-full ${weatherData.sources?.open_meteo ? "bg-emerald-400" : "bg-rose-400"}`}
            />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-white uppercase">
            {weatherData.current.source === "openweather"
              ? "OWM Active"
              : "OM Active"}
          </span>
        </button>
      )}

      {/* EXPLANATORY MODAL */}
      {isSourceModalOpen && (
        <div
          className="fixed inset-0 z-[1050] flex items-center justify-center p-4 sm:p-6"
          onClick={handleClose}
        >
          <div className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-200" />

          <div
            className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-2xl duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal box
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-900 p-5 text-white">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold">Data Sources</h3>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 bg-slate-50 p-6">
              <p className="text-sm text-slate-600">
                BetterIligan uses a dual-provider system to ensure weather data
                remains available even if one service experiences downtime.
              </p>

              {isFallback ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-1 text-sm font-bold text-amber-800">
                    ⚠️ Offline Mode
                  </p>
                  <p className="text-xs text-amber-700">
                    Both primary weather APIs are currently unreachable. You are
                    viewing cached fallback data. Please check your connection
                    or try again later.
                  </p>
                </div>
              ) : (
                <>
                  {/* OpenWeather Status */}
                  <Link
                    href="https://openweathermap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                        OpenWeatherMap
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          weatherData.sources?.open_weather
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {weatherData.sources?.open_weather
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Primary source for current real-time conditions
                      (temperature, humidity, wind).
                    </p>
                  </Link>

                  {/* Open-Meteo Status */}
                  <Link
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                        Open-Meteo
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          weatherData.sources?.open_meteo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {weatherData.sources?.open_meteo ? "Online" : "Offline"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Primary source for the detailed 7-day forecast, rain
                      probabilities, and UV index.
                    </p>
                  </Link>

                  <div className="mt-4 text-center text-xs text-slate-500">
                    Current conditions routed via{" "}
                    <strong className="text-slate-700">
                      {weatherData.current.source === "openweather"
                        ? "OpenWeatherMap"
                        : "Open-Meteo"}
                    </strong>
                    .
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default WeatherStatusBadge;
