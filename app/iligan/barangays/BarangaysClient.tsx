"use client";

import { useState, useMemo } from "react";
import { MapPin, User, Phone, Mail, Users, Search } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import FilterGrid from "@/components/ui/FilterGrid";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
// Adjust this import path based on where you save your barangay JSON data
import allBarangays from "@/data/iligan/barangay.json";

type SortOption =
  | "A-Z (Alphabetical)"
  | "Z-A (Alphabetical)"
  | "Population: High to Low"
  | "Population: Low to High";

const SORT_OPTIONS: SortOption[] = [
  "A-Z (Alphabetical)",
  "Z-A (Alphabetical)",
  "Population: High to Low",
  "Population: Low to High",
];

export default function BarangaysClient() {
  // Instead of category filtering, we use a search query for Barangays
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] =
    useState<SortOption>("A-Z (Alphabetical)");

  const barangayReferences = [
    {
      title: "iligan.gov.ph - Brangays",
      url: "https://iligan.gov.ph/forresidents/barangays?1715183843",
    },
  ];

  // 1. Filter AND Sort the data using useMemo for performance
  const processedBarangays = useMemo(() => {
    // First, filter by search query
    const result = allBarangays.filter(
      (barangay) =>
        barangay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        barangay.representative.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    // Then, sort the filtered result based on the activeSort state
    result.sort((a, b) => {
      // Helper function to safely parse population strings (e.g., "6,506" -> 6506)
      const parsePop = (popString: string) =>
        parseInt(popString.replace(/,/g, ""), 10) || 0;

      switch (activeSort) {
        case "A-Z (Alphabetical)":
          return a.name.localeCompare(b.name);
        case "Z-A (Alphabetical)":
          return b.name.localeCompare(a.name);
        case "Population: High to Low":
          return parsePop(b.population) - parsePop(a.population);
        case "Population: Low to High":
          return parsePop(a.population) - parsePop(b.population);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, activeSort]); // Re-run when query or sort changes

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Local Units
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Barangay Directory</SubpageHero.Title>
        <SubpageHero.Description>
          Explore the official directory of Iligan City&apos;s 44 barangays,
          including contact information for local offices and Punong Barangays.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="container mx-auto px-4 py-12 md:px-6">
        {/* Search Bar Container */}
        <div className="container mx-auto px-4 pt-8 md:px-6">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a barangay or official's name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-medium text-slate-700 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Layout using your FilterGrid */}
        <FilterGrid>
          <FilterGrid.Sidebar
            title="Sort Barangays"
            categories={SORT_OPTIONS}
            activeCategory={activeSort}
            onCategoryChange={(sort) => setActiveSort(sort as SortOption)}
          />

          <FilterGrid.Content
            title={
              searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Barangays"
            }
            itemCount={processedBarangays.length}
            columns={3}
          >
            {processedBarangays.map((barangay, index) => (
              <div
                key={index}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                {/* Header: Name & Population */}
                <div className="mb-5 border-b border-slate-100 pb-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      Brgy. {barangay.name}
                    </h3>
                    <div className="shrink-0 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    <Users className="h-3.5 w-3.5" />
                    {barangay.population} Residents
                  </div>
                </div>

                {/* Body: Representative & Contacts */}
                <div className="flex-grow space-y-4">
                  {/* Representative */}
                  {barangay.representative?.name && (
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Punong Barangay
                        </p>
                        <p className="text-sm leading-tight font-semibold text-slate-800">
                          {barangay.representative.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone Numbers */}
                  {barangay.numbers && barangay.numbers.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="space-y-1.5">
                        <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Hotlines
                        </p>
                        {barangay.numbers.map((num, i) => (
                          <a
                            key={i}
                            href={`tel:${num.replace(/[^0-9+]/g, "")}`}
                            className="block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {num}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emails */}
                  {barangay.emails && barangay.emails.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="space-y-1">
                        <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Email
                        </p>
                        {barangay.emails.map((email, i) => (
                          <a
                            key={i}
                            href={`mailto:${email}`}
                            className="block truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {processedBarangays.length === 0 && (
              <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-500">
                <Search className="mb-3 h-8 w-8 text-slate-300" />
                <p className="text-lg font-medium">No barangays found</p>
                <p className="mt-1 text-sm">Try adjusting your search query.</p>
              </div>
            )}
          </FilterGrid.Content>
        </FilterGrid>

        <ReferencesFooter className="mx-4" references={barangayReferences} />
      </div>
    </main>
  );
}
