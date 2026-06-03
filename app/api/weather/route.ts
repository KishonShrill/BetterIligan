import { NextResponse } from 'next/server';
import { OpenWeatherResponse } from '@/types/weather';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId') || process.env.NEXT_PUBLIC_WEATHER_CITY_ID;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

        // next: { revalidate: 300 } caches the response for 5 minutes so you don't spam the API
        const response = await fetch(url, { next: { revalidate: 300 } });

        if (!response.ok) throw new Error('Failed to fetch weather');

        const data: OpenWeatherResponse = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
