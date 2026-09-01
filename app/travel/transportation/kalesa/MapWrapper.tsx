'use client'

import dynamic from 'next/dynamic';

const InteractiveKalesaMap = dynamic(
    () => import('./InteractiveKalesaMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-medium">
                Loading Kalesa Map...
            </div>
        )
    }
);

export default function MapWrapper() {
    return <InteractiveKalesaMap />;
}