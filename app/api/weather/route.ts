import { env } from "cloudflare:workers";
import { fetchWeatherApi } from "openmeteo";
import { OpenWeatherData, OpenMeteoData } from "@/types/weather";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const OPEN_METEO_CACHE_KEY = "weather:forecast:iligan";
const OPEN_WEATHER_CACHE_KEY = "weather:current:iligan";

const OPEN_METEO_CACHE_TTL = 60 * 60 * 12; // 12 hours
const OPEN_WEATHER_CACHE_TTL = 60 * 60; // 1 hour

const LATITUDE = 8.2289;
const LONGITUDE = 124.2434;

const OPEN_WEATHER_CITY_ID = "1711082";

const params = {
  latitude: LATITUDE,
  longitude: LONGITUDE,

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
   * ---------------------------------------------------------
   * 1. Get cached data
   * ---------------------------------------------------------
   */

  const [cachedOpenMeteo, cachedOpenWeather] = await Promise.all([
    env.WEATHER_CACHE.get(
      OPEN_METEO_CACHE_KEY,
      "json",
    ) as Promise<OpenMeteoData | null>,

    env.WEATHER_CACHE.get(
      OPEN_WEATHER_CACHE_KEY,
      "json",
    ) as Promise<OpenWeatherData | null>,
  ]);

  /*
   * ---------------------------------------------------------
   * 2. Open-Meteo
   * ---------------------------------------------------------
   */

  let openMeteo: OpenMeteoData | null = cachedOpenMeteo;
  let openMeteoOnline = true;
  if (!openMeteo) {
    try {
      const responses = await fetchWeatherApi(OPEN_METEO_URL, params);

      if (!responses.length) {
        throw new Error("Open-Meteo returned no data.");
      }

      const response = responses[0];
      const latitude = response.latitude();
      const longitude = response.longitude();
      const elevation = response.elevation();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current();
      const daily = response.daily();

      if (!current || !daily) {
        throw new Error("Open-Meteo returned incomplete data.");
      }

      const sunrise = daily.variables(8);

      const sunset = daily.variables(9);

      openMeteo = {
        location: {
          latitude,
          longitude,
          elevation,
          timezone,
          timezone_abbreviation: timezoneAbbreviation,
          utc_offset_seconds: utcOffsetSeconds,
        },

        current: {
          time: new Date(Number(current.time()) * 1000).toISOString(),
          relative_humidity_2m: current.variables(0)?.value() ?? 0,
          precipitation: current.variables(1)?.value() ?? 0,
          surface_pressure: current.variables(2)?.value() ?? 0,
          wind_speed_10m: current.variables(3)?.value() ?? 0,
          wind_direction_10m: current.variables(4)?.value() ?? 0,
          wind_gusts_10m: current.variables(5)?.value() ?? 0,
          is_day: current.variables(6)?.value() ?? 0,
          cloud_cover: current.variables(7)?.value() ?? 0,
          temperature_2m: current.variables(8)?.value() ?? 0,
          apparent_temperature: current.variables(9)?.value() ?? 0,
          weather_code: current.variables(10)?.value() ?? 0,
        },

        daily: {
          time: Array.from(
            {
              length:
                (Number(daily.timeEnd()) - Number(daily.time())) /
                daily.interval(),
            },
            (_, i) =>
              new Date(
                (Number(daily.time()) + i * daily.interval()) * 1000,
              ).toISOString(),
          ),

          weather_code: daily.variables(0)?.valuesArray() ?? [],
          temperature_2m_max: daily.variables(1)?.valuesArray() ?? [],
          temperature_2m_min: daily.variables(2)?.valuesArray() ?? [],
          apparent_temperature_max: daily.variables(3)?.valuesArray() ?? [],
          apparent_temperature_min: daily.variables(4)?.valuesArray() ?? [],
          precipitation_sum: daily.variables(5)?.valuesArray() ?? [],
          precipitation_probability_max:
            daily.variables(6)?.valuesArray() ?? [],
          precipitation_hours: daily.variables(7)?.valuesArray() ?? [],
          sunrise: sunrise
            ? Array.from(
                {
                  length: sunrise.valuesInt64Length(),
                },
                (_, i) =>
                  new Date(Number(sunrise.valuesInt64(i)) * 1000).toISOString(),
              )
            : [],
          sunset: sunset
            ? Array.from(
                {
                  length: sunset.valuesInt64Length(),
                },
                (_, i) =>
                  new Date(Number(sunset.valuesInt64(i)) * 1000).toISOString(),
              )
            : [],
          uv_index_max: daily.variables(10)?.valuesArray() ?? [],
          uv_index_clear_sky_max: daily.variables(11)?.valuesArray() ?? [],
        },
      };

      /*
       * Cache the fresh Open-Meteo data.
       */
      await env.WEATHER_CACHE.put(
        OPEN_METEO_CACHE_KEY,
        JSON.stringify(openMeteo),
        {
          expirationTtl: OPEN_METEO_CACHE_TTL,
        },
      );
    } catch (error) {
      console.error("Open-Meteo failed:", error);

      /*
       * If we don't have Open-Meteo data
       * and the API fails, the whole endpoint
       * cannot provide a forecast.
       */
      if (!openMeteo) {
        return Response.json(
          {
            error: "Weather forecast unavailable.",
            sources: {
              open_meteo: false,
              open_weather: Boolean(cachedOpenWeather),
            },
          },
          {
            status: 502,
          },
        );
      }

      openMeteoOnline = false;
    }
  }

  /*
   * ---------------------------------------------------------
   * 3. OpenWeather
   * ---------------------------------------------------------
   */

  let openWeather: OpenWeatherData | null = cachedOpenWeather;
  let openWeatherOnline = true;
  if (!openWeather) {
    try {
      const apiKey = env.OPENWEATHER_API_KEY;

      if (!apiKey) {
        throw new Error("OpenWeather API key is missing.");
      }

      const url =
        `${OPEN_WEATHER_URL}?` +
        new URLSearchParams({
          id: OPEN_WEATHER_CITY_ID,
          appid: apiKey,
          units: "metric",
        });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OpenWeather request failed: ${response.status}`);
      }

      openWeather = (await response.json()) as OpenWeatherData;

      /*
       * Cache current weather for 1 hour.
       */
      await env.WEATHER_CACHE.put(
        OPEN_WEATHER_CACHE_KEY,
        JSON.stringify(openWeather),
        {
          expirationTtl: OPEN_WEATHER_CACHE_TTL,
        },
      );
    } catch (error) {
      console.error("OpenWeather failed:", error);

      /*
       * OpenWeather failure does NOT
       * break the endpoint.
       */
      openWeatherOnline = false;
    }
  }

  /*
   * ---------------------------------------------------------
   * 4. Select current weather source
   * ---------------------------------------------------------
   *
   * OpenWeather takes priority.
   *
   * If unavailable, use Open-Meteo current data.
   */

  let current;
  if (openWeather) {
    current = {
      time: new Date(openWeather.dt * 1000).toISOString(),
      temperature: openWeather.main.temp,
      feels_like: openWeather.main.feels_like,
      humidity: openWeather.main.humidity,
      wind_speed: openWeather.wind.speed,
      wind_direction: openWeather.wind.deg,
      wind_gust: openWeather.wind.gust ?? null,
      visibility: openWeather.visibility,
      weather: openWeather.weather[0],
      pressure: openWeather.main.pressure,
      clouds: openWeather.clouds.all,
      sunrise: new Date(openWeather.sys.sunrise * 1000).toISOString(),
      sunset: new Date(openWeather.sys.sunset * 1000).toISOString(),
      source: "openweather",
    };
  } else {
    /*
     * OpenWeather unavailable.
     *
     * Fall back to Open-Meteo's current
     * conditions.
     */
    current = {
      time: openMeteo.current.time,
      temperature: openMeteo.current.temperature_2m,
      feels_like: openMeteo.current.apparent_temperature,
      humidity: openMeteo.current.relative_humidity_2m,
      wind_speed: openMeteo.current.wind_speed_10m,
      wind_direction: openMeteo.current.wind_direction_10m,
      wind_gust: openMeteo.current.wind_gusts_10m,

      /*
       * Open-Meteo doesn't provide
       * visibility in your requested
       * variables.
       */
      visibility: null,
      weather: {
        id: openMeteo.current.weather_code,
        main: "Weather",
        description: "Open-Meteo weather condition",
        icon: null,
      },
      pressure: openMeteo.current.surface_pressure,
      clouds: openMeteo.current.cloud_cover,
      sunrise: openMeteo.daily.sunrise[0],
      sunset: openMeteo.daily.sunset[0],
      source: "openmeteo",
    };
  }

  /*
   * ---------------------------------------------------------
   * 5. Return combined response
   * ---------------------------------------------------------
   */

  return Response.json(
    {
      location: openMeteo.location,
      current,
      forecast: openMeteo.daily,
      sources: {
        open_meteo: openMeteoOnline || Boolean(cachedOpenMeteo),
        open_weather: openWeatherOnline || Boolean(cachedOpenWeather),
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
