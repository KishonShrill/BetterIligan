"use client";

import { useEffect, useState } from "react";
import { ResultAsync, ok, err } from "neverthrow";
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  Droplets,
  Wind,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { FALLBACK_WEATHER } from "@/data/fallback/fallback_weather";

function getWeatherIcon(code: number, isDay = true) {
  // WMO Codes (0-99)
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return isDay ? CloudSun : Cloud;
  if (code === 3 || (code >= 45 && code <= 48)) return Cloud;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return CloudRain;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return Cloud;
  if (code >= 95 && code <= 99) return CloudLightning;

  // OpenWeather Codes (200-804)
  if (code >= 200 && code < 300) return CloudLightning;
  if (code >= 300 && code < 600) return CloudRain;
  if (code >= 600 && code < 800) return Cloud;
  if (code === 800) return isDay ? Sun : Moon;
  if (code === 801 || code === 802) return isDay ? CloudSun : Cloud;
  if (code >= 803) return Cloud;

  return CloudSun;
}

// OpenWeather condition ids & WMO codes that warrant an advisory tone
function isAdvisoryWeather(code: number): boolean {
  return (
    (code >= 200 && code < 300) ||
    (code >= 500 && code < 600) ||
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  );
}

export default function WeatherBanner() {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const result = await ResultAsync.fromPromise(
        fetch("/api/weather"),
        (e) => new Error(e instanceof Error ? e.message : "Network error"),
      )
        .andThen((res) =>
          res.ok
            ? ResultAsync.fromPromise(
                res.json() as Promise<any>,
                () => new Error("Failed to parse response JSON"),
              )
            : err(new Error(`API Unavailable: ${res.status}`)),
        )
        .andThen((data: any) =>
          data?.error ? err(new Error(data.error)) : ok(data),
        );

      if (cancelled) return;
      result.match(
        (data) => {
          setWeatherData(data);
          setIsFallback(false);
        },
        () => {
          setWeatherData({
            current: {
              temperature: FALLBACK_WEATHER.main.temp,
              feels_like: FALLBACK_WEATHER.main.feels_like,
              humidity: FALLBACK_WEATHER.main.humidity,
              wind_speed: FALLBACK_WEATHER.wind.speed * 3.6,
              weather: FALLBACK_WEATHER.weather[0],
              time: new Date().toISOString(),
            },
          });
          setIsFallback(true);
        },
      );
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-blue-600 p-5 text-sm font-medium text-white shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        Loading current conditions…
      </div>
    );
  }

  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const weatherCode = current.weather?.id ?? 0;
  const description =
    current.weather?.description || current.weather?.main || "Fair";
  const advisory = isAdvisoryWeather(weatherCode);

  const IconComponent = getWeatherIcon(weatherCode, true);

  return (
    <div
      role="status"
      className={`rounded-lg p-5 text-white shadow-sm ${advisory ? "bg-red-600" : "bg-blue-600"}`}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-3">
          <IconComponent className="h-12 w-12 shrink-0 text-white" />
          <div>
            <p className="text-3xl leading-none font-extrabold">
              {Math.round(current.temperature)}°C
            </p>
            <p className="mt-1 text-sm font-medium capitalize opacity-90">
              {description} · Iligan City
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="h-4 w-4 opacity-80" aria-hidden />
            {Math.round(current.humidity)}%
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wind className="h-4 w-4 opacity-80" aria-hidden />
            {Math.round(current.wind_speed)} km/h
          </span>
          {isFallback && (
            <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              Cached
            </span>
          )}
        </div>
      </div>

      {advisory && (
        <p className="mt-3 flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-bold">
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
          Rain or storm conditions — monitor PAGASA and follow local advisories.
        </p>
      )}
    </div>
  );
}
