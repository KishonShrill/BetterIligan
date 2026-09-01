"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterGrid from "@/components/ui/FilterGrid";
import ResolutionCard from "@/components/ResolutionCard";
import { ResolutionsData } from "@/validations/resolutionSchema";

type TypeFilter = "all" | "resolution" | "ordinance";

interface ResolutionsInteractiveProps {
  data: ResolutionsData;
}

export default function ResolutionsInteractive({
  data,
}: ResolutionsInteractiveProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        data.entries
          .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
          .map((r) => r.category),
      ),
    );
    return ["All", ...unique.sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.entries.filter((r) => {
      const matchesCategory =
        selectedCategory === "All" || r.category === selectedCategory;
      const matchesType = selectedType === "all" || r.type === selectedType;
      const matchesSearch =
        r.title.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.number.includes(query);
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, selectedType, searchQuery, data]);

  return (
    <>
      <div className="container mx-auto px-4 pt-6 md:px-6">
        <div className="group relative mx-auto mb-2 max-w-2xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Search by title or resolution/ordinance number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>

        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            {(["all", "resolution", "ordinance"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-colors ${selectedType === t ? "bg-emerald-700 text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {t === "all" ? "All Types" : `${t}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FilterGrid className="py-0! md:py-0!">
        <FilterGrid.Sidebar
          title="Categories"
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <FilterGrid.Content
          title={selectedCategory}
          itemCount={filtered.length}
          columns={2}
        >
          {filtered.length > 0 ? (
            filtered.map((r) => (
              <ResolutionCard key={r.number} resolution={r} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                No resolutions found
              </h3>
              <p className="mx-auto max-w-sm text-sm text-slate-500">
                Try a different search term or category.
              </p>
            </div>
          )}
        </FilterGrid.Content>
      </FilterGrid>
    </>
  );
}
