export interface WeatherResponse {
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
    timezone_abbreviation: string;
    utc_offset_seconds: number;
  };

  current: {
    time: string;
    relative_humidity_2m: number;
    precipitation: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    is_day: number;
    cloud_cover: number;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };

  daily: {
    time: string[];
    weather_code: Record<string, number>;
    temperature_2m_max: Record<string, number>;
    temperature_2m_min: Record<string, number>;
    apparent_temperature_max: Record<string, number>;
    apparent_temperature_min: Record<string, number>;
    precipitation_sum: Record<string, number>;
    precipitation_probability_max: Record<string, number>;
    precipitation_hours: Record<string, number>;
    sunrise: string[];
    sunset: string[];
    uv_index_max: Record<string, number>;
    uv_index_clear_sky_max: Record<string, number>;
  };
}
