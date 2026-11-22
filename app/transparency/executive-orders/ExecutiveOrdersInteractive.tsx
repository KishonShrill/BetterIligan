"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterGrid from "@/components/ui/FilterGrid";
import ExecutiveOrderCard from "@/components/ExecutiveOrderCard";
import { ExecutiveOrdersData } from "@/validations/executiveOrderSchema";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ExecutiveOrdersInteractiveProps {
  data: ExecutiveOrdersData;
}

export default function ExecutiveOrdersInteractive({
  data,
}: ExecutiveOrdersInteractiveProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.entries
      .sort((a, b) => b.publication_date.localeCompare(a.publication_date))
      .filter((order) => {
        const formattedDate = formatDate(order.publication_date);
        return (
          order.title.toLowerCase().includes(query) ||
          order.description.toLowerCase().includes(query) ||
          order.publication_date.includes(query) ||
          formattedDate.toLowerCase().includes(query)
        );
      });
  }, [searchQuery, data]);

  return (
    <>
      <div className="container mx-auto mb-6 px-4 pt-6 md:px-6">
        <div className="group relative mx-auto mb-2 max-w-2xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Search by title, description, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>
      </div>

      <FilterGrid className="py-0! md:py-0!">
        <FilterGrid.Content
          title="Executive Orders"
          itemCount={filtered.length}
          columns={3}
          hasSidebar={false}
        >
          {filtered.length > 0 ? (
            filtered.map((order) => (
              <ExecutiveOrderCard key={order.archive_code} order={order} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                No executive orders found
              </h3>
              <p className="mx-auto max-w-sm text-sm text-slate-500">
                Try a different search term.
              </p>
            </div>
          )}
        </FilterGrid.Content>
      </FilterGrid>
    </>
  );
}
