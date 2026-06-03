import { OpenWeatherResponse } from "@/types/weather";
export const FALLBACK_WEATHER: OpenWeatherResponse = {
    coord: { lon: 124.4, lat: 8.25 },
    weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    base: "stations",
    main: {
        temp: 31.02,
        feels_like: 35.14,
        temp_min: 31.02,
        temp_max: 31.02,
        pressure: 1011,
        humidity: 61,
    },
    visibility: 10000,
    wind: { speed: 2.06, deg: 327 },
    clouds: { all: 100 },
    dt: 1780456118, // Represents the last known update
    sys: { country: "PH", sunrise: 1780435404, sunset: 1780480673 },
    timezone: 28800,
    id: 1711082,
    name: "Iligan City",
    cod: 200
};
