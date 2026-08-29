"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  title?: string;
}

export default function FilterGridSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  title = "Filter by Type",
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="lg:sticky lg:top-24 lg:col-span-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 transition-colors md:px-5 md:py-4 lg:pointer-events-none lg:cursor-default"
        >
          <h3 className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">
            {title}
          </h3>
          <div className="rounded-md border border-slate-200 bg-white p-1 text-slate-500 shadow-sm lg:hidden">
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </div>
        </button>

        <ul
          className={`flex-col ${isMobileMenuOpen ? "flex" : "hidden"} lg:flex`}
        >
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => {
                  onCategoryChange(category);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full border-l-2 px-5 py-3.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "border-blue-600 bg-blue-50/50 text-blue-700"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
