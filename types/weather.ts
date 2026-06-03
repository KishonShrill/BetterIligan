export interface WeatherCoord {
    lon: number;
    lat: number;
}

export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface WeatherMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

export interface WeatherWind {
    speed: number;
    deg: number;
    gust?: number;
}

export interface WeatherClouds {
    all: number;
}

export interface WeatherSys {
    country: string;
    sunrise: number;
    sunset: number;
}

export interface OpenWeatherResponse {
    coord: WeatherCoord;
    weather: WeatherCondition[];
    base: string;
    main: WeatherMain;
    visibility: number;
    wind: WeatherWind;
    clouds: WeatherClouds;
    dt: number;
    sys: WeatherSys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
