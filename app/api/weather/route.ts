import { NextResponse } from "next/server";
import { OpenWeatherResponse } from "@/types/weather";

export const revalidate = 900;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId =
    searchParams.get("cityId") || process.env.NEXT_PUBLIC_WEATHER_CITY_ID;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data: OpenWeatherResponse = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
