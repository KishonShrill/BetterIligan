"use client";

import dynamic from "next/dynamic";

const InteractiveKalesaMap = dynamic(() => import("./InteractiveKalesaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full animate-pulse items-center justify-center rounded-2xl bg-slate-100 font-medium text-slate-500">
      Loading Kalesa Map...
    </div>
  ),
});

export default function MapWrapper() {
  return <InteractiveKalesaMap />;
}
