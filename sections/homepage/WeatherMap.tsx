"use client";

import { useState, useEffect } from "react";
import { ResultAsync, ok, err } from "neverthrow";
import {
    CloudSun, Wind, Droplets, ThermometerSun, MapPin, X,
    Sunrise, Sunset, Eye, Compass, Sun, Moon, Cloud, CloudRain,
    CloudLightning, Loader2,
} from "lucide-react";

import Section from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FALLBACK_WEATHER } from "@/data/fallback/fallback_weather";
import { WeatherResponse } from "@/types/weather";

type WeatherIconComponent = typeof Sun;

interface WeatherInfo {
    label: string;
    icon: WeatherIconComponent;
}

const getWeatherInfo = (
    code: number,
    isDay = true,
): WeatherInfo => {
    if (code === 0) {
        return {
            label: "Clear sky",
            icon: isDay ? Sun : Moon,
        };
    }

    if (code === 1) {
        return {
            label: "Mainly clear",
            icon: isDay ? Sun : Moon,
        };
    }

    if (code === 2) {
        return {
            label: "Partly cloudy",
            icon: CloudSun,
        };
    }

    if (code === 3) {
        return {
            label: "Overcast",
            icon: Cloud,
        };
    }

    if ([45, 48].includes(code)) {
        return {
            label: "Fog",
            icon: Cloud,
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            label: "Drizzle",
            icon: CloudRain,
        };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return {
            label: "Rain",
            icon: CloudRain,
        };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return {
            label: "Snow",
            icon: Cloud,
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            label: "Thunderstorm",
            icon: CloudLightning,
        };
    }

    return {
        label: "Unknown",
        icon: CloudSun,
    };
};

const getDailyValue = (
    values: Record<string, number>,
    index: number,
) => {
    return values[String(index)] ?? 0;
};

const formatWeatherTime = (
    dateString: string,
    timezone: string,
) => {
    return new Intl.DateTimeFormat("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: timezone,
    }).format(new Date(dateString));
};

const formatWeatherDate = (
    dateString: string,
    timezone: string,
) => {
    return new Intl.DateTimeFormat("en-PH", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: timezone,
    }).format(new Date(dateString));
};

const getWindDirection = (degrees: number) => {
    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
    ];

    return directions[
        Math.round(degrees / 45) % 8
    ];
};

interface WeatherMetricProps {
    icon: typeof Droplets;
    label: string;
    value: string;
}

const WeatherMetric = ({
    icon: Icon,
    label,
    value,
}: WeatherMetricProps) => {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <Icon className="mb-2 h-5 w-5 text-blue-500" />

            <p className="mb-1 text-xs text-slate-500">
                {label}
            </p>

            <p className="text-lg font-bold text-slate-800">
                {value}
            </p>
        </div>
    );
};

export default function WeatherAndMap() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [weatherData, setWeatherData] =
        useState<WeatherResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);

            const result = await ResultAsync.fromPromise(
                fetch("/api/weather"),
                (error) =>
                    new Error(
                        error instanceof Error
                            ? error.message
                            : "Network error",
                    ),
            )
                .andThen((res) => {
                    if (!res.ok) {
                        return err(
                            new Error(
                                `API Unavailable: Status ${res.status}`,
                            ),
                        );
                    }

                    return ResultAsync.fromPromise(
                        res.json() as Promise<WeatherResponse>,
                        () =>
                            new Error(
                                "Failed to parse response JSON",
                            ),
                    );
                })
                .andThen((data: WeatherResponse | { error?: string }) => {
                    if (
                        data &&
                        "error" in data &&
                        data.error
                    ) {
                        return err(new Error(data.error));
                    }

                    return ok(data as WeatherResponse);
                });

            result.match(
                (data) => {
                    setWeatherData(data);
                    setIsFallback(false);
                    setError(null);
                },
                (error) => {
                    console.error(
                        "Using fallback weather data due to error:",
                        error.message,
                    );

                    /*
                     * NOTE:
                     * FALLBACK_WEATHER still needs to be converted
                     * to the new Open-Meteo response structure.
                     */
                    setWeatherData(
                        FALLBACK_WEATHER as unknown as WeatherResponse,
                    );

                    setIsFallback(true);
                    setError(error.message);
                },
            );

            setLoading(false);
        };

        fetchWeather();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const currentWeather = weatherData
        ? getWeatherInfo(
            weatherData.current.weather_code,
            Boolean(weatherData.current.is_day),
        )
        : null;

    const CurrentWeatherIcon =
        currentWeather?.icon ?? CloudSun;

    return (
        <Section className="bg-white">
            {/* Section Header */}
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                    Weather & Location
                </h2>

                <Text
                    className="mx-auto mt-2 text-sm text-slate-600 md:text-base"
                    size="md"
                >
                    Current conditions and interactive map of Iligan City
                </Text>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-12">
                {/* WEATHER CARD */}
                <div
                    onClick={() =>
                        !loading &&
                        weatherData &&
                        setIsModalOpen(true)
                    }
                    className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 lg:col-span-4 ${!loading && weatherData
                        ? "group cursor-pointer hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                        : ""
                        }`}
                >
                    {loading ? (
                        <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-500" />

                            <p className="font-medium text-slate-500">
                                Fetching weather data...
                            </p>
                        </div>
                    ) : weatherData ? (
                        <>
                            {/* Current Weather */}
                            <div className="relative overflow-hidden bg-blue-600 p-6 text-white">
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-100">
                                                Iligan City
                                            </p>

                                            <p className="mt-0.5 text-xs text-blue-200">
                                                Current weather
                                            </p>
                                        </div>

                                        {isFallback && (
                                            <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-950 uppercase">
                                                Offline
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 flex items-center gap-4">
                                        <CurrentWeatherIcon className="h-16 w-16 shrink-0 text-white" />

                                        <div>
                                            <h3 className="text-5xl font-bold tracking-tight">
                                                {Math.round(
                                                    weatherData.current
                                                        .temperature_2m,
                                                )}
                                                °C
                                            </h3>

                                            <p className="mt-1 text-lg font-medium text-blue-50">
                                                {currentWeather?.label}
                                            </p>

                                            <p className="mt-0.5 text-sm text-blue-100">
                                                Feels like{" "}
                                                {Math.round(
                                                    weatherData.current
                                                        .apparent_temperature,
                                                )}
                                                °C
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <CurrentWeatherIcon className="absolute -right-8 -top-8 h-40 w-40 rotate-12 text-white opacity-10" />
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 border-b border-slate-100">
                                <div className="p-4 text-center">
                                    <Droplets className="mx-auto mb-1 h-4 w-4 text-blue-500" />

                                    <p className="text-xs text-slate-500">
                                        Humidity
                                    </p>

                                    <p className="font-bold text-slate-800">
                                        {Math.round(
                                            weatherData.current
                                                .relative_humidity_2m,
                                        )}
                                        %
                                    </p>
                                </div>

                                <div className="border-x border-slate-100 p-4 text-center">
                                    <Wind className="mx-auto mb-1 h-4 w-4 text-slate-500" />

                                    <p className="text-xs text-slate-500">
                                        Wind
                                    </p>

                                    <p className="font-bold text-slate-800">
                                        {Math.round(
                                            weatherData.current
                                                .wind_speed_10m,
                                        )}{" "}
                                        km/h
                                    </p>
                                </div>

                                <div className="p-4 text-center">
                                    <Cloud className="mx-auto mb-1 h-4 w-4 text-slate-400" />

                                    <p className="text-xs text-slate-500">
                                        Clouds
                                    </p>

                                    <p className="font-bold text-slate-800">
                                        {Math.round(
                                            weatherData.current
                                                .cloud_cover,
                                        )}
                                        %
                                    </p>
                                </div>
                            </div>

                            {/* Today's Forecast */}
                            <div className="bg-slate-50 px-5 py-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                        Today's Forecast
                                    </span>

                                    <span className="text-xs font-semibold text-blue-600">
                                        {Math.round(
                                            getDailyValue(
                                                weatherData.daily
                                                    .precipitation_probability_max,
                                                0,
                                            ),
                                        )}
                                        % rain
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        {(() => {
                                            const info =
                                                getWeatherInfo(
                                                    getDailyValue(
                                                        weatherData.daily
                                                            .weather_code,
                                                        0,
                                                    ),
                                                );

                                            const Icon = info.icon;

                                            return (
                                                <Icon className="h-8 w-8 shrink-0 text-blue-500" />
                                            );
                                        })()}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {
                                                    getWeatherInfo(
                                                        getDailyValue(
                                                            weatherData.daily
                                                                .weather_code,
                                                            0,
                                                        ),
                                                    ).label
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {getDailyValue(
                                                    weatherData.daily
                                                        .precipitation_sum,
                                                    0,
                                                ).toFixed(1)}{" "}
                                                mm ·{" "}
                                                {Math.round(
                                                    getDailyValue(
                                                        weatherData.daily
                                                            .precipitation_hours,
                                                        0,
                                                    ),
                                                )}
                                                h rain
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="font-bold text-slate-800">
                                            {Math.round(
                                                getDailyValue(
                                                    weatherData.daily
                                                        .temperature_2m_max,
                                                    0,
                                                ),
                                            )}
                                            °
                                            <span className="font-medium text-slate-400">
                                                {" "}
                                                /{" "}
                                                {Math.round(
                                                    getDailyValue(
                                                        weatherData.daily
                                                            .temperature_2m_min,
                                                        0,
                                                    ),
                                                )}
                                                °
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-100 bg-white p-3 text-center text-xs font-medium text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                {isFallback
                                    ? "Viewing offline data • Click for details"
                                    : "Click to view 7-day forecast →"}
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-[360px] flex-1 items-center justify-center text-slate-500">
                            Unable to load weather
                        </div>
                    )}
                </div>

                {/* MAP CARD */}
                <div className="flex h-100 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8 lg:h-auto">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                        <MapPin className="h-5 w-5 text-blue-600" />

                        <h3 className="font-semibold text-slate-800">
                            City Map
                        </h3>
                    </div>

                    <div className="relative w-full flex-1 bg-slate-100">
                        <iframe
                            title="Map of Iligan City"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123662.66186301723!2d124.34488950644513!3d8.2392162636839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x325579b328c9540d0%3A0xe6e208aba2f0d03b!2sIligan%20City%2C%20Lanao%20del%20Norte!5e0!3m2!1sen!2sph!4v1782954555571!5m2!1sen!2sph"
                            className="absolute inset-0 h-full w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
                        <span>
                            📍 Iligan City Hall, Buhanginan Hills
                        </span>

                        <a
                            href="https://maps.app.goo.gl/YSWKTjcjZamf2dqC8"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View Larger Map
                        </a>
                    </div>
                </div>
            </div>

            {/* WEATHER DETAILS MODAL */}
            {isModalOpen && weatherData && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-200"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
                        {/* Modal Header */}
                        <div className="relative bg-blue-600 p-6 text-white sm:p-8">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsModalOpen(false)
                                }
                                aria-label="Close weather details"
                                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <p className="mb-1 text-sm font-medium text-blue-100">
                                Detailed Weather Report
                            </p>

                            <h2 className="mb-5 text-2xl font-bold sm:text-3xl">
                                Iligan City
                            </h2>

                            <div className="flex items-center gap-4">
                                <CurrentWeatherIcon className="h-20 w-20 shrink-0 text-white" />

                                <div>
                                    <div className="text-6xl font-bold tracking-tight sm:text-7xl">
                                        {Math.round(
                                            weatherData.current
                                                .temperature_2m,
                                        )}
                                        °C
                                    </div>

                                    <p className="text-xl font-medium text-blue-50">
                                        {currentWeather?.label}
                                    </p>

                                    <p className="mt-1 text-sm text-blue-100">
                                        Feels like{" "}
                                        {Math.round(
                                            weatherData.current
                                                .apparent_temperature,
                                        )}
                                        °C
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[calc(90vh-268px)] overflow-y-auto bg-slate-50 p-6 sm:p-8">
                            {/* 7-Day Forecast */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
                                    7-Day Forecast
                                </h3>

                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    {weatherData.daily.time.map(
                                        (date, index) => {
                                            const info =
                                                getWeatherInfo(
                                                    getDailyValue(
                                                        weatherData.daily
                                                            .weather_code,
                                                        index,
                                                    ),
                                                );

                                            const Icon = info.icon;

                                            const isToday =
                                                index === 0;

                                            return (
                                                <div
                                                    key={date}
                                                    className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-4 py-3 sm:px-5 ${index !== 0
                                                        ? "border-t border-slate-100"
                                                        : ""
                                                        }`}
                                                >
                                                    <div className="min-w-0">
                                                        <p
                                                            className={`text-sm font-semibold ${isToday
                                                                ? "text-blue-600"
                                                                : "text-slate-700"
                                                                }`}
                                                        >
                                                            {isToday
                                                                ? "Today"
                                                                : formatWeatherDate(
                                                                    date,
                                                                    weatherData
                                                                        .location
                                                                        .timezone,
                                                                )}
                                                        </p>

                                                        <p className="truncate text-xs text-slate-400">
                                                            {
                                                                info.label
                                                            }
                                                        </p>
                                                    </div>

                                                    <Icon className="h-7 w-7 shrink-0 text-blue-500" />

                                                    <div className="text-right text-sm">
                                                        <span className="font-bold text-slate-800">
                                                            {Math.round(
                                                                getDailyValue(
                                                                    weatherData
                                                                        .daily
                                                                        .temperature_2m_max,
                                                                    index,
                                                                ),
                                                            )}
                                                            °
                                                        </span>

                                                        <span className="ml-1 text-slate-400">
                                                            {Math.round(
                                                                getDailyValue(
                                                                    weatherData
                                                                        .daily
                                                                        .temperature_2m_min,
                                                                    index,
                                                                ),
                                                            )}
                                                            °
                                                        </span>
                                                    </div>

                                                    <div className="w-12 text-right">
                                                        <p className="text-xs font-semibold text-blue-600">
                                                            {Math.round(
                                                                getDailyValue(
                                                                    weatherData
                                                                        .daily
                                                                        .precipitation_probability_max,
                                                                    index,
                                                                ),
                                                            )}
                                                            %
                                                        </p>

                                                        <p className="text-[10px] text-slate-400">
                                                            rain
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>

                            {/* Current Conditions */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
                                    Current Conditions
                                </h3>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <WeatherMetric
                                        icon={Droplets}
                                        label="Humidity"
                                        value={`${Math.round(
                                            weatherData.current
                                                .relative_humidity_2m,
                                        )}%`}
                                    />

                                    <WeatherMetric
                                        icon={Wind}
                                        label="Wind Speed"
                                        value={`${Math.round(
                                            weatherData.current
                                                .wind_speed_10m,
                                        )} km/h`}
                                    />

                                    <WeatherMetric
                                        icon={Wind}
                                        label="Wind Gusts"
                                        value={`${Math.round(
                                            weatherData.current
                                                .wind_gusts_10m,
                                        )} km/h`}
                                    />

                                    <WeatherMetric
                                        icon={Compass}
                                        label="Wind Direction"
                                        value={`${getWindDirection(
                                            weatherData.current
                                                .wind_direction_10m,
                                        )} · ${Math.round(
                                            weatherData.current
                                                .wind_direction_10m,
                                        )}°`}
                                    />

                                    <WeatherMetric
                                        icon={Cloud}
                                        label="Cloud Cover"
                                        value={`${Math.round(
                                            weatherData.current
                                                .cloud_cover,
                                        )}%`}
                                    />

                                    <WeatherMetric
                                        icon={Compass}
                                        label="Pressure"
                                        value={`${Math.round(
                                            weatherData.current
                                                .surface_pressure,
                                        )} hPa`}
                                    />
                                </div>
                            </div>

                            {/* Sunrise / Sunset */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
                                    Sun & UV
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <div className="rounded-lg bg-orange-50 p-3">
                                            <Sunrise className="h-6 w-6 text-orange-500" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-slate-500">
                                                Sunrise
                                            </p>

                                            <p className="text-lg font-bold text-slate-800">
                                                {formatWeatherTime(
                                                    weatherData.daily
                                                        .sunrise[0],
                                                    weatherData.location
                                                        .timezone,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <div className="rounded-lg bg-purple-50 p-3">
                                            <Sunset className="h-6 w-6 text-purple-500" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-slate-500">
                                                Sunset
                                            </p>

                                            <p className="text-lg font-bold text-slate-800">
                                                {formatWeatherTime(
                                                    weatherData.daily
                                                        .sunset[0],
                                                    weatherData.location
                                                        .timezone,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <div className="rounded-lg bg-yellow-50 p-3">
                                            <Sun className="h-6 w-6 text-yellow-500" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-slate-500">
                                                UV Index
                                            </p>

                                            <p className="text-lg font-bold text-slate-800">
                                                {getDailyValue(
                                                    weatherData.daily
                                                        .uv_index_max,
                                                    0,
                                                ).toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Extended Details */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
                                    Today's Forecast Details
                                </h3>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <WeatherMetric
                                        icon={ThermometerSun}
                                        label="High"
                                        value={`${Math.round(
                                            getDailyValue(
                                                weatherData.daily
                                                    .temperature_2m_max,
                                                0,
                                            ),
                                        )}°C`}
                                    />

                                    <WeatherMetric
                                        icon={ThermometerSun}
                                        label="Low"
                                        value={`${Math.round(
                                            getDailyValue(
                                                weatherData.daily
                                                    .temperature_2m_min,
                                                0,
                                            ),
                                        )}°C`}
                                    />

                                    <WeatherMetric
                                        icon={CloudRain}
                                        label="Rain"
                                        value={`${getDailyValue(
                                            weatherData.daily
                                                .precipitation_sum,
                                            0,
                                        ).toFixed(1)} mm`}
                                    />

                                    <WeatherMetric
                                        icon={CloudRain}
                                        label="Rain Hours"
                                        value={`${Math.round(
                                            getDailyValue(
                                                weatherData.daily
                                                    .precipitation_hours,
                                                0,
                                            ),
                                        )} hrs`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
}
