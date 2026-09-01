"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Globe, Facebook, Building } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { allAgencies } from "@/data/government";
import { AgencyCategory } from "@/validations/agencySchema";
import FilterGrid from "@/components/ui/FilterGrid";
import ReferencesFooter from "@/components/ui/ReferencesFooter";

const CATEGORIES: ("All Agencies" | AgencyCategory)[] = [
  "All Agencies",
  "National Agencies",
  "LGU Offices",
  "GOCCs",
  "Constitutional Commissions",
  "Programs & Associations",
];

export default function DirectoryClient() {
  const [activeCategory, setActiveCategory] = useState<
    "All Agencies" | AgencyCategory
  >("All Agencies");

  const agenciesReferences = [
    {
      title: "iligan.gov.ph - National Government Agencies/Offices",
      url: "https://iligan.gov.ph/forresidents/nationalgovernmentagenciesoffices?163429964",
    },
  ];

  const filteredAgencies =
    activeCategory === "All Agencies"
      ? allAgencies
      : allAgencies.filter((agency) => agency.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            Official Directory
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>National Agencies</SubpageHero.Title>
        <SubpageHero.Description>
          A comprehensive directory of local and national government offices,
          bureaus, and corporations operating within Iligan City.
        </SubpageHero.Description>
      </SubpageHero>

      {/* Main Layout */}
      <div className="container mx-auto">
        <FilterGrid>
          <FilterGrid.Sidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={(category) =>
              setActiveCategory(category as "All Agencies" | AgencyCategory)
            }
            title="Filter by Type"
          />

          <FilterGrid.Content
            title={activeCategory}
            itemCount={filteredAgencies.length}
            columns={3}
          >
            {filteredAgencies.map((agency, idx) => (
              <div
                key={idx}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Top: Logo & Category Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2">
                    {agency.logoUrl ? (
                      <Image
                        src={agency.logoUrl}
                        alt={agency.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : (
                      <Building className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {agency.category}
                  </span>
                </div>

                {/* Middle: Title & Address */}
                <div className="mb-6 flex-1">
                  <h3 className="mb-2 text-lg leading-tight font-bold text-slate-900">
                    {agency.name}
                  </h3>
                  <p className="flex items-start gap-1.5 text-sm text-slate-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="line-clamp-2">{agency.address}</span>
                  </p>
                </div>

                {/* Bottom: Action Buttons */}
                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  {/* Primary Map Button */}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(agency.name + " Iligan City")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Map
                  </a>

                  {/* Website Button */}
                  {agency.websiteUrl && (
                    <a
                      href={agency.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                      title="Visit Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}

                  {/* Facebook Button */}
                  {agency.facebookUrl && (
                    <a
                      href={agency.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      title="Visit Facebook Page"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </FilterGrid.Content>
        </FilterGrid>
        <ReferencesFooter className="mx-4" references={agenciesReferences} />
      </div>
    </main>
  );
}
