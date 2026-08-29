"use client";

import { useState } from "react";

type Tab =
  | "all"
  | "demographics"
  | "government"
  | "economy"
  | "environment"
  | "infrastructure";

// We pass the rendered UI sections as a dictionary so the client
// just swaps them out without re-rendering the heavy data.
export default function CityTabs({
  sections,
}: {
  sections: Record<Tab, React.ReactNode>;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const tabs: Tab[] = [
    "all",
    "demographics",
    "government",
    "economy",
    "environment",
    "infrastructure",
  ];

  return (
    <>
      <div
        className="my-5 flex touch-pan-x scrollbar-none gap-1 overflow-x-auto"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            className={`rounded-full border border-[#B5D4F4] px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all duration-150 ${
              activeTab === tab
                ? "border-[#042C53] bg-[#042C53] text-white"
                : "bg-transparent text-[#0C447C] hover:bg-[#E6F1FB]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">{sections[activeTab]}</div>
    </>
  );
}
