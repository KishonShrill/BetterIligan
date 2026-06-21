'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Cloud, CloudRain, Sun, CloudLightning, Phone } from 'lucide-react';

const ILIGAN_LAT = 8.2280;
const ILIGAN_LNG = 124.2452;
const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'SGD', 'KRW', 'CNY'];

type ClassName = { className?: string; }

export default function TopBanner({ className }: ClassName) {
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [rates, setRates] = useState<Record<string, number>>({});
    const [currIdx, setCurrIdx] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${ILIGAN_LAT}&longitude=${ILIGAN_LNG}&current=temperature_2m,weather_code`
        )
            .then((r) => r.json())
            .then((data) => {
                setWeather({
                    temp: Math.round(data.current?.temperature_2m),
                    code: data.current?.weather_code,
                });
            })
            .catch(() => { });

        fetch('https://api.exchangerate-api.com/v4/latest/PHP')
            .then((r) => r.json())
            .then((data) => setRates(data.rates || {}))
            .catch(() => { });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrIdx((i) => (i + 1) % CURRENCIES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const weatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-3 w-3 text-amber-500" />;
        if (code <= 3) return <Cloud className="h-3 w-3 text-slate-400" />;
        if (code <= 67) return <CloudRain className="h-3 w-3 text-sky-500" />;
        return <CloudLightning className="h-3 w-3 text-violet-500" />;
    };

    const curr = CURRENCIES[currIdx];
    const rate = rates[curr] ? (1 / rates[curr]).toFixed(2) : null;

    return (
        <div className={`${className} ${pathname === "/travel/transportation" && "hidden"} bg-slate-50 border-b border-slate-200 text-[10px] sm:text-xs font-sans`}>
            <div className="container mx-auto px-4 py-1 sm:py-2 flex items-center justify-between sm:justify-end sm:gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                    <span className="text-slate-500">
                        {new Date().toLocaleDateString('en-PH', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                    {weather && (
                        <span className="inline-flex items-center gap-1">
                            {weatherIcon(weather.code)} {weather.temp}°C
                        </span>
                    )}
                    {rate && (
                        <span key={curr} className="text-emerald-600 font-medium animate-fade-in">
                            {curr} ₱{rate}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-slate-600 sm:border-l sm:border-slate-300 sm:pl-4">
                    <Phone className="h-3 w-3 text-red-500" />
                    <a href="tel:911" className="font-semibold text-red-600 hover:underline">
                        911
                    </a>
                    <span className="text-slate-300 hidden sm:inline mx-1">·</span>
                    <a
                        href="tel:09171234567"
                        className="text-slate-600 hover:text-primary-600 hidden sm:inline"
                    >
                        CDRRMO Iligan
                    </a>
                </div>
            </div>
        </div>
    );
}
