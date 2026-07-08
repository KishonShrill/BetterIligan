'use client'

import { useEffect, useState } from 'react';
import { ResultAsync, ok, err } from 'neverthrow';
import {
    Sun, Cloud, CloudRain, CloudLightning, CloudSun,
    Droplets, Wind, Loader2, TriangleAlert,
} from 'lucide-react';
import type { OpenWeatherResponse } from '@/types/weather';
import { FALLBACK_WEATHER } from '@/data/fallback/fallback_weather';

function conditionIcon(iconCode: string, className: string) {
    switch (iconCode) {
        case '01d': case '01n': return <Sun className={className} />;
        case '09d': case '09n': case '10d': case '10n': return <CloudRain className={className} />;
        case '11d': case '11n': return <CloudLightning className={className} />;
        case '02d': case '02n': case '03d': case '03n':
        case '04d': case '04n': return <Cloud className={className} />;
        default: return <CloudSun className={className} />;
    }
}

// OpenWeather condition ids: 2xx thunderstorm, 5xx rain, 7xx squall/atmosphere.
// These warrant an advisory tone on the disaster hub; everything else is calm.
function isAdvisoryWeather(id: number): boolean {
    return id < 600 || (id >= 700 && id < 800 && id !== 701 && id !== 721);
}

export default function WeatherBanner() {
    const [weather, setWeather] = useState<OpenWeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const result = await ResultAsync.fromPromise(
                fetch('/api/weather'),
                (e) => new Error(e instanceof Error ? e.message : 'Network error'),
            )
                .andThen((res) =>
                    res.ok
                        ? ResultAsync.fromPromise(
                              res.json() as Promise<OpenWeatherResponse>,
                              () => new Error('Failed to parse response JSON'),
                          )
                        : err(new Error(`API Unavailable: ${res.status}`)),
                )
                .andThen((data: OpenWeatherResponse & { error?: string }) =>
                    data?.error ? err(new Error(data.error)) : ok(data),
                );

            if (cancelled) return;
            result.match(
                (data) => { setWeather(data); setIsFallback(false); },
                () => { setWeather(FALLBACK_WEATHER); setIsFallback(true); },
            );
            setLoading(false);
        };

        run();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-3 rounded-lg bg-blue-600 p-5 text-sm font-medium text-white shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                Loading current conditions…
            </div>
        );
    }

    if (!weather) return null;

    const condition = weather.weather[0];
    const advisory = isAdvisoryWeather(condition.id);

    return (
        <div
            role="status"
            className={`rounded-lg p-5 text-white shadow-sm ${advisory ? 'bg-red-600' : 'bg-blue-600'}`}
        >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-3">
                    {conditionIcon(condition.icon, 'w-12 h-12 text-white shrink-0')}
                    <div>
                        <p className="text-3xl font-extrabold leading-none">
                            {Math.round(weather.main.temp)}°C
                        </p>
                        <p className="text-sm font-medium capitalize opacity-90 mt-1">
                            {condition.description} · {weather.name}, {weather.sys.country}
                        </p>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4 text-sm font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 opacity-80" aria-hidden />
                        {weather.main.humidity}%
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Wind className="w-4 h-4 opacity-80" aria-hidden />
                        {Math.round(weather.wind.speed * 3.6)} km/h
                    </span>
                    {isFallback && (
                        <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Cached
                        </span>
                    )}
                </div>
            </div>

            {advisory && (
                <p className="mt-3 flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-bold">
                    <TriangleAlert className="w-4 h-4 shrink-0" aria-hidden />
                    Rain or storm conditions — monitor PAGASA and follow local advisories.
                </p>
            )}
        </div>
    );
}
