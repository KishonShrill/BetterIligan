'use client'

import dynamic from 'next/dynamic';

const InteractiveJeepneyMap = dynamic(
    () => import('./InteractiveJeepneyMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-medium">
                Loading Map...
            </div>
        )
    }
);

export default function MapWrapper() {
    return <InteractiveJeepneyMap />;
}
