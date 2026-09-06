import { env } from "cloudflare:workers";
import { fetchWeatherApi } from "openmeteo";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const WEATHER_CACHE_KEY = "weather:iligan";

// TODO: change from 1 hour to 1 day
const CACHE_TTL = 60 * 60;

const params = {
    latitude: 8.2289,
    longitude: 124.2434,

    daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "precipitation_sum",
        "precipitation_probability_max",
        "precipitation_hours",
        "sunrise",
        "sunset",
        "uv_index_max",
        "uv_index_clear_sky_max",
    ],

    current: [
        "relative_humidity_2m",
        "precipitation",
        "surface_pressure",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
        "is_day",
        "cloud_cover",
        "temperature_2m",
        "apparent_temperature",
        "weather_code",
    ],

    timezone: "Asia/Manila",

    forecast_days: 7,
};

export async function GET() {
    /*
     * 1. Check KV first.
     *
     * If the weather is already cached, don't call Open-Meteo.
     */
    const cached = await env.WEATHER_CACHE.get(WEATHER_CACHE_KEY, "json");

    if (cached) {
        return Response.json(cached, {
            headers: {
                "Cache-Control": "public, max-age=3600",
                "X-Weather-Cache": "HIT",
            },
        });
    }

    /*
     * 2. Cache miss.
     *
     * Fetch fresh weather data from Open-Meteo.
     */
    const responses = await fetchWeatherApi(OPEN_METEO_URL, params);

    if (!responses.length) {
        return Response.json(
            {
                error: "Open-Meteo returned no weather data.",
            },
            { status: 502 },
        );
    }

    const response = responses[0];

    /*
     * 3. Get location/timezone information.
     */
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    /*
     * 4. Get current and daily weather.
     */
    const current = response.current();
    const daily = response.daily();

    if (!current || !daily) {
        return Response.json(
            {
                error: "Open-Meteo returned incomplete weather data.",
            },
            { status: 502 },
        );
    }

    /*
     * 5. Sunrise and sunset are Int64 values.
     */
    const sunrise = daily.variables(8);
    const sunset = daily.variables(9);

    /*
     * 6. Convert Open-Meteo's response into a normal JSON object.
     */
    const weatherData = {
        location: {
            latitude,
            longitude,
            elevation,
            timezone,
            timezone_abbreviation: timezoneAbbreviation,
            utc_offset_seconds: utcOffsetSeconds,
        },

        current: {
            time: new Date(
                (Number(current.time()) + utcOffsetSeconds) * 1000,
            ).toISOString(),
            relative_humidity_2m: current.variables(0)?.value(),
            precipitation: current.variables(1)?.value(),
            surface_pressure: current.variables(2)?.value(),
            wind_speed_10m: current.variables(3)?.value(),
            wind_direction_10m: current.variables(4)?.value(),
            wind_gusts_10m: current.variables(5)?.value(),
            is_day: current.variables(6)?.value(),
            cloud_cover: current.variables(7)?.value(),
            temperature_2m: current.variables(8)?.value(),
            apparent_temperature: current.variables(9)?.value(),
            weather_code: current.variables(10)?.value(),
        },

        daily: {
            time: Array.from(
                {
                    length:
                        (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
                },
                (_, i) =>
                    new Date(
                        (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                        1000,
                    ).toISOString(),
            ),
            weather_code: daily.variables(0)?.valuesArray(),
            temperature_2m_max: daily.variables(1)?.valuesArray(),
            temperature_2m_min: daily.variables(2)?.valuesArray(),
            apparent_temperature_max: daily.variables(3)?.valuesArray(),
            apparent_temperature_min: daily.variables(4)?.valuesArray(),
            precipitation_sum: daily.variables(5)?.valuesArray(),
            precipitation_probability_max: daily.variables(6)?.valuesArray(),
            precipitation_hours: daily.variables(7)?.valuesArray(),
            sunrise: sunrise
                ? Array.from(
                    {
                        length: sunrise.valuesInt64Length(),
                    },
                    (_, i) =>
                        new Date(
                            (Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000,
                        ).toISOString(),
                )
                : [],
            sunset: sunset
                ? Array.from(
                    {
                        length: sunset.valuesInt64Length(),
                    },
                    (_, i) =>
                        new Date(
                            (Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000,
                        ).toISOString(),
                )
                : [],
            uv_index_max: daily.variables(10)?.valuesArray(),
            uv_index_clear_sky_max: daily.variables(11)?.valuesArray(),
        },
    };

    /*
     * 7. Store the processed result in KV.
     *
     * It will automatically expire after one hour.
     */
    await env.WEATHER_CACHE.put(WEATHER_CACHE_KEY, JSON.stringify(weatherData), {
        expirationTtl: CACHE_TTL,
    });

    /*
     * 8. Return the fresh data.
     */
    return Response.json(weatherData, {
        headers: {
            "Cache-Control": "public, max-age=3600",
            "X-Weather-Cache": "MISS",
        },
    });
}
