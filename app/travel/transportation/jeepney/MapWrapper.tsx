"use client";

import dynamic from "next/dynamic";

const InteractiveJeepneyMap = dynamic(() => import("./InteractiveJeepneyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh w-full animate-pulse items-center justify-center rounded-2xl bg-slate-100 font-medium text-slate-500">
      Loading Map...
    </div>
  ),
});

export default function MapWrapper() {
  return <InteractiveJeepneyMap />;
}
