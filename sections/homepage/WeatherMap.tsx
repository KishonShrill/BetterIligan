'use client'

import React, { useState, useEffect } from 'react';
import { ResultAsync, ok, err } from 'neverthrow';
import {
    CloudSun, Wind, Droplets, ThermometerSun, MapPin, X,
    Sunrise, Sunset, Eye, Compass, Sun, Moon, Cloud,
    CloudRain, CloudLightning, Loader2
} from 'lucide-react';

import Section from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { OpenWeatherResponse } from '@/types/weather';
import { FALLBACK_WEATHER } from '@/data/fallback/fallback_weather';

// Helper to map OpenWeatherMap icon codes to Lucide React icons
const getWeatherIcon = (iconCode: string, className = "w-16 h-16 text-yellow-300") => {
    switch (iconCode) {
        case '01d': return <Sun className={className} />;
        case '01n': return <Moon className={`text-slate-200 ${className}`} />;
        case '02d': case '02n': case '03d': case '03n':
        case '04d': case '04n': return <Cloud className={`text-slate-300 ${className}`} />;
        case '09d': case '09n': case '10d': case '10n': return <CloudRain className={`text-blue-300 ${className}`} />;
        case '11d': case '11n': return <CloudLightning className={`text-yellow-400 ${className}`} />;
        default: return <CloudSun className={className} />;
    }
};

// Helper to convert UNIX timestamps to readable local time
const formatTime = (unixTime: number) => {
    return new Date(unixTime * 1000).toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export default function WeatherAndMap() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weatherData, setWeatherData] = useState<OpenWeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [error, setError] = useState<string | null>(null)

    // Fetch weather data when the component mounts
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);

            const result = await ResultAsync.fromPromise(
                fetch('/api/weather'),
                (error) => new Error(error instanceof Error ? error.message : 'Network error')
            )
                .andThen((res) => {
                    if (!res.ok) {
                        return err(new Error(`API Unavailable: Status ${res.status}`));
                    }
                    return ResultAsync.fromPromise(
                        res.json() as Promise<OpenWeatherResponse>,
                        (jsonError) => new Error('Failed to parse response JSON')
                    );
                })
                .andThen((data: any) => {
                    if (data && data.error) {
                        return err(new Error(data.error));
                    }
                    return ok(data as OpenWeatherResponse);
                });

            result.match(
                (data) => {
                    setWeatherData(data);
                    setIsFallback(false);
                    setError(null);
                },
                (error) => {
                    console.error("Using fallback weather data due to error:", error.message);
                    setWeatherData(FALLBACK_WEATHER);
                    setIsFallback(true);
                    setError(error.message);
                }
            );

            setLoading(false);
        };
        fetchWeather();
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    return (
        <Section className='bg-white'>

            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Weather & Location</h2>
                <Text className='text-slate-600 mt-2 mx-auto' size='md'>Current conditions and interactive map of Iligan City</Text>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">

                {/* WEATHER CARD (Interactive) */}
                <div
                    onClick={() => !loading && weatherData && setIsModalOpen(true)}
                    className={`lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${!loading && weatherData ? 'cursor-context-menu hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 group' : ''}`}
                >
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                            <p className="text-slate-500 font-medium">Fetching satellite data...</p>
                        </div>
                    ) : weatherData ? (
                        <>
                            <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <p className="text-blue-100 text-sm font-medium mb-1">
                                            {weatherData.name}, {weatherData.sys.country}
                                        </p>
                                        {/* Fallback Badge */}
                                        {isFallback && (
                                            <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        {getWeatherIcon(weatherData.weather[0].icon, "w-16 h-16")}
                                        <div>
                                            <h3 className="text-5xl font-bold tracking-tight">{Math.round(weatherData.main.temp)}°C</h3>
                                            <p className="text-lg font-medium text-blue-50 mt-1 capitalize">
                                                {weatherData.weather[0].description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {getWeatherIcon(weatherData.weather[0].icon, "absolute -right-8 -top-8 w-40 h-40 opacity-20 rotate-12")}
                            </div>

                            <div className="p-6 grid grid-cols-3 gap-4 bg-white flex-1 content-center">
                                <div className="flex flex-col items-center text-center">
                                    <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                                    <span className="text-xs text-slate-500 uppercase font-semibold">Humidity</span>
                                    <span className="text-base font-bold text-slate-800">{weatherData.main.humidity}%</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-x border-slate-100">
                                    <Wind className="w-5 h-5 text-slate-400 mb-2" />
                                    <span className="text-xs text-slate-500 uppercase font-semibold">Wind</span>
                                    {/* Convert m/s to km/h */}
                                    <span className="text-base font-bold text-slate-800">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <ThermometerSun className="w-5 h-5 text-orange-500 mb-2" />
                                    <span className="text-xs text-slate-500 uppercase font-semibold">Feels Like</span>
                                    <span className="text-base font-bold text-slate-800">{Math.round(weatherData.main.feels_like)}°C</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 text-center text-xs text-slate-500 font-medium border-t border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                {isFallback ? "Viewing cached data • Click for details" : "Click to view detailed forecast →"}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 min-h-[300px]">Unable to load weather</div>
                    )}
                </div>

                {/* MAP CARD */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-100 lg:h-auto">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-800">City Map</h3>
                    </div>

                    <div className="flex-1 w-full relative bg-slate-100">
                        <iframe
                            title="Map of Iligan City"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            // Using the standard Google Maps embed URL (No API key required)
                            src="https://maps.google.com/maps?q=Iligan%20City%20Hall,%20Buhanginan%20Hills,%20Iligan%20City&t=&z=14&ie=UTF8&iwloc=&output=embed"
                            className="absolute inset-0 w-full h-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="px-6 py-3 bg-white text-xs text-slate-500 flex justify-between items-center border-t border-slate-100">
                        <span>📍 Iligan City Hall, Buhanginan Hills</span>
                        <a href="https://www.openstreetmap.org/?mlat=8.2280&mlon=124.2452#map=13/8.2280/124.2452" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            View Larger Map
                        </a>
                    </div>
                </div>
            </div>

            {/* WEATHER DETAILS MODAL */}
            {isModalOpen && weatherData && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-blue-600 p-6 sm:p-8 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <p className="text-blue-100 text-sm font-medium mb-1">Detailed Weather Report</p>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{weatherData.name}</h2>

                            <div className="flex items-center gap-4">
                                {getWeatherIcon(weatherData.weather[0].icon, "w-20 h-20")}
                                <div>
                                    <div className="text-6xl sm:text-7xl font-bold tracking-tight">{Math.round(weatherData.main.temp)}°C</div>
                                    <p className="text-xl font-medium text-blue-50">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Conditions</h3>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                                    <p className="text-xs text-slate-500 mb-1">Humidity</p>
                                    <p className="text-lg font-bold text-slate-800">{weatherData.main.humidity}%</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <Wind className="w-5 h-5 text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500 mb-1">Wind Speed</p>
                                    <p className="text-lg font-bold text-slate-800">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <Eye className="w-5 h-5 text-indigo-500 mb-2" />
                                    <p className="text-xs text-slate-500 mb-1">Visibility</p>
                                    <p className="text-lg font-bold text-slate-800">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <Compass className="w-5 h-5 text-teal-500 mb-2" />
                                    <p className="text-xs text-slate-500 mb-1">Pressure</p>
                                    <p className="text-lg font-bold text-slate-800">{weatherData.main.pressure} hPa</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="bg-orange-50 p-3 rounded-lg"><Sunrise className="w-6 h-6 text-orange-500" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Sunrise</p>
                                        <p className="text-lg font-bold text-slate-800">{formatTime(weatherData.sys.sunrise)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="bg-purple-50 p-3 rounded-lg"><Sunset className="w-6 h-6 text-purple-500" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Sunset</p>
                                        <p className="text-lg font-bold text-slate-800">{formatTime(weatherData.sys.sunset)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
}
