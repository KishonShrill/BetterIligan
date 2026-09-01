"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import FilterGrid from "@/components/ui/FilterGrid";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import BidCard from "@/components/BidCard";
import { BidsData, getBidStatus } from "@/validations/bidSchema";
import rawBidsData from "@/data/iligan/bids.json";

const bidsData = rawBidsData as BidsData;

type StatusFilter = "All" | "Open for Bidding" | "Awarded" | "Ongoing";

export default function BidsClient() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return bidsData.entries.filter((b) => {
      const status = getBidStatus(b.stages);
      const matchesStatus =
        selectedStatus === "All" || status === selectedStatus;
      const matchesSearch =
        b.title.toLowerCase().includes(query) ||
        b.reference.toLowerCase().includes(query) ||
        b.office.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [selectedStatus, searchQuery]);

  const bidsReferences = [
    {
      title: "City Government of Iligan — Bids & Procurement",
      url: "https://iligan.gov.ph/transparency/bidsandprocurement",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/transparency" text="Back to Transparency" />
      <SubpageHero>
        <SubpageHero.Title>Bids & Procurement</SubpageHero.Title>
        <SubpageHero.Description>
          Every open, awarded, and in-progress procurement from the City
          Government of Iligan — with a direct link to the actual bid documents
          for each stage.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="container mx-auto px-4 pt-6 md:px-6">
        <div className="group relative mx-auto mb-2 max-w-2xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Search by title, bid reference, or office..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>
        <div className="mb-4 flex justify-center">
          <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1">
            {(["All", "Open for Bidding", "Awarded", "Ongoing"] as const).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${selectedStatus === s ? "bg-emerald-700 text-white" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <FilterGrid className="py-0! md:py-0!">
        <FilterGrid.Content
          title="Procurement Projects"
          itemCount={filtered.length}
          hasSidebar={false}
        >
          {filtered.length > 0 ? (
            <div className="col-span-full flex flex-col gap-4">
              {filtered.map((b) => (
                <BidCard key={b.reference} bid={b} />
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                No procurement projects found
              </h3>
              <p className="mx-auto max-w-sm text-sm text-slate-500">
                Try a different search term or status.
              </p>
            </div>
          )}
        </FilterGrid.Content>
      </FilterGrid>

      <div className="container mx-auto px-4 md:px-6">
        <ReferencesFooter
          references={bidsReferences}
          disclaimer="Every project listed here was individually verified against the city's live Bids & Procurement page, with each stage document (ITB/NOA/NTP) confirmed as a real, reachable PDF before being added."
        />
      </div>
    </main>
  );
}
