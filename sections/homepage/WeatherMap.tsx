"use client";

import { useState, useEffect } from "react";
import { ResultAsync, ok, err } from "neverthrow";
import {
  CloudSun,
  Wind,
  Droplets,
  ThermometerSun,
  MapPin,
  X,
  Sunrise,
  Sunset,
  Compass,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  Loader2,
} from "lucide-react";

import Section from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FALLBACK_WEATHER } from "@/data/fallback/fallback_weather";
import WeatherStatusBadge from "@/components/modals/WeatherStatusBadgeModal";

type WeatherIconComponent = typeof Sun;

const WEATHER_CODES: Record<number, { label: string }> = {
  0: { label: "Clear sky" },
  1: { label: "Mainly clear" },
  2: { label: "Partly cloudy" },
  3: { label: "Overcast" },
  45: { label: "Fog" },
  48: { label: "Fog" },
  51: { label: "Drizzle" },
  53: { label: "Drizzle" },
  55: { label: "Drizzle" },
  56: { label: "Drizzle" },
  57: { label: "Drizzle" },
  61: { label: "Rain" },
  63: { label: "Rain" },
  65: { label: "Rain" },
  66: { label: "Rain" },
  67: { label: "Rain" },
  71: { label: "Snow" },
  73: { label: "Snow" },
  75: { label: "Snow" },
  77: { label: "Snow" },
  80: { label: "Rain Showers" },
  81: { label: "Rain Showers" },
  82: { label: "Rain Showers" },
  85: { label: "Snow Showers" },
  86: { label: "Snow Showers" },
  95: { label: "Thunderstorm" },
  96: { label: "Thunderstorm" },
  99: { label: "Thunderstorm" },
};

// Unified Icon Mapper handling both WMO (0-99) and OpenWeather (200-804) codes
const getUnifiedWeatherIcon = (
  code: number,
  isDay = true,
): WeatherIconComponent => {
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
};

const getUnifiedWeatherLabel = (
  code: number,
  fallbackLabel?: string,
): string => {
  if (fallbackLabel) {
    // Capitalize the first letter of the API description
    return fallbackLabel.charAt(0).toUpperCase() + fallbackLabel.slice(1);
  }
  return WEATHER_CODES[code]?.label ?? "Unknown";
};

// Extracts values mapped by string indices like {"0": 34.6, "1": 32.1}
const getDailyValue = (values: Record<string, number>, index: number) => {
  return values?.[String(index)] ?? 0;
};

const formatWeatherTime = (dateString: string, timezone: string) => {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(new Date(dateString));
};

const formatWeatherDate = (dateString: string, timezone: string) => {
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  }).format(new Date(dateString));
};

const getWindDirection = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
};

interface WeatherMetricProps {
  icon: typeof Droplets;
  label: string;
  value: string;
}

const WeatherMetric = ({ icon: Icon, label, value }: WeatherMetricProps) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <Icon className="mb-2 h-5 w-5 text-blue-500" />
      <p className="mb-1 text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
};

const WeatherIcon = ({
  code,
  isDay = true,
  className,
}: {
  code: number;
  isDay?: boolean;
  className?: string;
}) => {
  const Icon = getUnifiedWeatherIcon(code, isDay);
  return <Icon className={className} />;
};

export default function WeatherAndMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);

      const result = await ResultAsync.fromPromise(
        fetch("/api/weather"),
        (error) =>
          new Error(error instanceof Error ? error.message : "Network error"),
      )
        .andThen((res) => {
          if (!res.ok) {
            return err(new Error(`API Unavailable: Status ${res.status}`));
          }
          return ResultAsync.fromPromise(
            res.json(),
            () => new Error("Failed to parse response JSON"),
          );
        })
        .andThen((data: any) => {
          if (data && "error" in data && data.error) {
            return err(new Error(data.error));
          }
          return ok(data);
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
          setWeatherData(FALLBACK_WEATHER);
          setIsFallback(true);
          setError(error.message);
        },
      );

      setLoading(false);
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Determine if it is currently daytime
  const isDay = weatherData
    ? new Date(weatherData.current.time).getTime() >
        new Date(weatherData.current.sunrise).getTime() &&
      new Date(weatherData.current.time).getTime() <
        new Date(weatherData.current.sunset).getTime()
    : true;

  const currentLabel = weatherData
    ? getUnifiedWeatherLabel(
        weatherData.current.weather?.id ?? 0,
        weatherData.current.weather?.description,
      )
    : "";

  const currentCode = weatherData?.current.weather?.id ?? 0;

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
          onClick={() => !loading && weatherData && setIsModalOpen(true)}
          className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 lg:col-span-4 ${
            !loading && weatherData
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

                    {/* Extracted Status Badge used here */}
                    <div className="flex flex-col items-end">
                      <WeatherStatusBadge
                        isFallback={isFallback}
                        weatherData={weatherData}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <WeatherIcon
                      code={currentCode}
                      isDay={isDay}
                      className="h-16 w-16 shrink-0 text-white"
                    />
                    <div>
                      <h3 className="text-5xl font-bold tracking-tight">
                        {Math.round(weatherData.current.temperature)}°C
                      </h3>
                      <p className="mt-1 text-lg font-medium text-blue-50">
                        {currentLabel}
                      </p>
                      <p className="mt-0.5 text-sm text-blue-100">
                        Feels like {Math.round(weatherData.current.feels_like)}
                        °C
                      </p>
                    </div>
                  </div>
                </div>
                <WeatherIcon
                  code={currentCode}
                  isDay={isDay}
                  className="absolute -top-8 -right-8 h-40 w-40 rotate-12 text-white opacity-10"
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 border-b border-slate-100">
                <div className="p-4 text-center">
                  <Droplets className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                  <p className="text-xs text-slate-500">Humidity</p>
                  <p className="font-bold text-slate-800">
                    {Math.round(weatherData.current.humidity)}%
                  </p>
                </div>
                <div className="border-x border-slate-100 p-4 text-center">
                  <Wind className="mx-auto mb-1 h-4 w-4 text-slate-500" />
                  <p className="text-xs text-slate-500">Wind</p>
                  <p className="font-bold text-slate-800">
                    {weatherData.current.wind_speed.toFixed(1)} km/h
                  </p>
                </div>
                <div className="p-4 text-center">
                  <Cloud className="mx-auto mb-1 h-4 w-4 text-slate-400" />
                  <p className="text-xs text-slate-500">Clouds</p>
                  <p className="font-bold text-slate-800">
                    {Math.round(weatherData.current.clouds)}%
                  </p>
                </div>
              </div>

              {/* Today's Forecast */}
              <div className="bg-slate-50 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Today&apos;s Forecast
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    {Math.round(
                      getDailyValue(
                        weatherData.forecast.precipitation_probability_max,
                        0,
                      ),
                    )}
                    % rain
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {(() => {
                      const code = getDailyValue(
                        weatherData.forecast.weather_code,
                        0,
                      );
                      const Icon = getUnifiedWeatherIcon(code, true);
                      return (
                        <Icon className="h-8 w-8 shrink-0 text-blue-500" />
                      );
                    })()}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {getUnifiedWeatherLabel(
                          getDailyValue(weatherData.forecast.weather_code, 0),
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getDailyValue(
                          weatherData.forecast.precipitation_sum,
                          0,
                        ).toFixed(1)}{" "}
                        mm ·{" "}
                        {Math.round(
                          getDailyValue(
                            weatherData.forecast.precipitation_hours,
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
                          weatherData.forecast.temperature_2m_max,
                          0,
                        ),
                      )}
                      °
                      <span className="font-medium text-slate-400">
                        {" "}
                        /{" "}
                        {Math.round(
                          getDailyValue(
                            weatherData.forecast.temperature_2m_min,
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
            <h3 className="font-semibold text-slate-800">City Map</h3>
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
            <span>📍 Iligan City Hall, Buhanginan Hills</span>
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
                onClick={() => setIsModalOpen(false)}
                aria-label="Close weather details"
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start justify-between pr-12">
                <div>
                  <p className="mb-1 text-sm font-medium text-blue-100">
                    Detailed Weather Report
                  </p>
                  <h2 className="mb-5 text-2xl font-bold sm:text-3xl">
                    Iligan City
                  </h2>
                </div>
                <div className="mt-1 flex flex-col items-end">
                  <WeatherStatusBadge
                    isFallback={isFallback}
                    weatherData={weatherData}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <WeatherIcon
                  code={currentCode}
                  isDay={isDay}
                  className="h-20 w-20 shrink-0 text-white"
                />
                <div>
                  <div className="text-6xl font-bold tracking-tight sm:text-7xl">
                    {Math.round(weatherData.current.temperature)}°C
                  </div>
                  <p className="text-xl font-medium text-blue-50">
                    {currentLabel}
                  </p>
                  <p className="mt-1 text-sm text-blue-100">
                    Feels like {Math.round(weatherData.current.feels_like)}°C
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

                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible">
                  {weatherData.forecast.time.map(
                    (date: string, index: number) => {
                      const code = getDailyValue(
                        weatherData.forecast.weather_code,
                        index,
                      );
                      const Icon = getUnifiedWeatherIcon(code, true);
                      const label = getUnifiedWeatherLabel(code);
                      const isToday = index === 0;

                      return (
                        <div
                          key={date}
                          className={`min-w-[160px] snap-start rounded-xl border p-4 sm:min-w-0 ${
                            isToday
                              ? "border-blue-200 bg-blue-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          {/* Date */}
                          <div className="mb-4">
                            <p
                              className={`text-sm font-bold ${isToday ? "text-blue-600" : "text-slate-700"}`}
                            >
                              {isToday
                                ? "Today"
                                : formatWeatherDate(
                                    date,
                                    weatherData.location.timezone,
                                  )}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {label}
                            </p>
                          </div>

                          {/* Weather Icon */}
                          <div className="mb-4 flex justify-center">
                            <Icon className="h-10 w-10 text-blue-500" />
                          </div>

                          {/* Temperature */}
                          <div className="mb-4 text-center">
                            <span className="text-2xl font-bold text-slate-800">
                              {Math.round(
                                getDailyValue(
                                  weatherData.forecast.temperature_2m_max,
                                  index,
                                ),
                              )}
                              °
                            </span>
                            <span className="ml-1 text-sm text-slate-400">
                              /{" "}
                              {Math.round(
                                getDailyValue(
                                  weatherData.forecast.temperature_2m_min,
                                  index,
                                ),
                              )}
                              °
                            </span>
                          </div>

                          {/* Rain */}
                          <div className="border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                Rain
                              </span>
                              <span className="text-xs font-bold text-blue-600">
                                {Math.round(
                                  getDailyValue(
                                    weatherData.forecast
                                      .precipitation_probability_max,
                                    index,
                                  ),
                                )}
                                %
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                              {getDailyValue(
                                weatherData.forecast.precipitation_sum,
                                index,
                              ).toFixed(1)}{" "}
                              mm ·{" "}
                              {Math.round(
                                getDailyValue(
                                  weatherData.forecast.precipitation_hours,
                                  index,
                                ),
                              )}
                              h
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
                    value={`${Math.round(weatherData.current.humidity)}%`}
                  />
                  <WeatherMetric
                    icon={Wind}
                    label="Wind Speed"
                    value={`${weatherData.current.wind_speed.toFixed(1)} km/h`}
                  />
                  <WeatherMetric
                    icon={Wind}
                    label="Wind Gusts"
                    value={`${weatherData.current.wind_gust.toFixed(1)} km/h`}
                  />
                  <WeatherMetric
                    icon={Compass}
                    label="Wind Direction"
                    value={`${getWindDirection(weatherData.current.wind_direction)} · ${Math.round(weatherData.current.wind_direction)}°`}
                  />
                  <WeatherMetric
                    icon={Cloud}
                    label="Cloud Cover"
                    value={`${Math.round(weatherData.current.clouds)}%`}
                  />
                  <WeatherMetric
                    icon={Compass}
                    label="Pressure"
                    value={`${Math.round(weatherData.current.pressure)} hPa`}
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
                          weatherData.forecast.sunrise[0],
                          weatherData.location.timezone,
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
                          weatherData.forecast.sunset[0],
                          weatherData.location.timezone,
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
                          weatherData.forecast.uv_index_max,
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
                  Today&apos;s Forecast Details
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <WeatherMetric
                    icon={ThermometerSun}
                    label="High"
                    value={`${Math.round(getDailyValue(weatherData.forecast.temperature_2m_max, 0))}°C`}
                  />
                  <WeatherMetric
                    icon={ThermometerSun}
                    label="Low"
                    value={`${Math.round(getDailyValue(weatherData.forecast.temperature_2m_min, 0))}°C`}
                  />
                  <WeatherMetric
                    icon={CloudRain}
                    label="Rain"
                    value={`${getDailyValue(weatherData.forecast.precipitation_sum, 0).toFixed(1)} mm`}
                  />
                  <WeatherMetric
                    icon={CloudRain}
                    label="Rain Hours"
                    value={`${Math.round(getDailyValue(weatherData.forecast.precipitation_hours, 0))} hrs`}
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
