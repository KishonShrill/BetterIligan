"use client";

import {
  useState,
  useMemo,
  useEffect,
  Suspense,
  useDeferredValue,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, PlusCircle } from "lucide-react";

import { allServices } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";
import FilterGrid from "@/components/ui/FilterGrid";
import ContributionModal from "@/components/ui/ContributionModal";

function ServicesDirectoryContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  // 1. Initialize both states from the URL
  const initialCategory = searchParams.get("category") || "All Services";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Dynamically generate the list of categories based on the data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allServices.map((s) => s.category)),
    );
    return ["All Services", ...uniqueCategories.sort()];
  }, []);

  // 2. Centralized URL Updater
  const updateUrl = (category: string, query: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All Services") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    if (query.trim() === "") {
      params.delete("q");
    } else {
      params.set("q", query);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  };

  // 3. Debounce Effect for Search URL updating
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrl(selectedCategory, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All Services");

    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // 4. Update Handlers (Notice how lightweight they are now!)
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Services");
  };

  // Filter services based on search text AND selected category
  const filteredServices = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase();

    return allServices.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        (service.tags &&
          service.tags.some((tag) => tag.toLowerCase().includes(query)));

      const matchesCategory =
        selectedCategory === "All Services" ||
        service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [deferredSearchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      <section className="px-4 pt-12 pb-4 text-center sm:pt-16 sm:pb-8 md:pt-20 md:pb-12">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Local Government Services
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-[14px] text-slate-500 sm:text-lg">
          Explore official municipal services from the Citizens Charter and
          community contributions. Choose a category to filter or search below.
        </p>

        <div className="group relative mx-auto max-w-2xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Search for services (e.g., Business Permit)..."
            value={searchQuery}
            onChange={handleSearchChange} /* Updated to use the new handler */
            className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>
      </section>

      <FilterGrid className="py-0! md:py-0!">
        {/* Left Sidebar: Categories */}
        <FilterGrid.Sidebar
          title="Categories"
          categories={categories} // Assuming 'categories' is defined above in your code
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Right Content: Results & Cards */}
        <FilterGrid.Content
          title={selectedCategory}
          itemCount={filteredServices.length}
          columns={2}
        >
          {filteredServices.length > 0 ? (
            <>
              {filteredServices.map((service, idx) => (
                <ServiceCard key={`service-${idx}`} service={service} />
              ))}

              {/* Missing Service CTA - Injected into the grid like a card! */}
              <div
                onClick={() => setIsContributionModalOpen(true)}
                className="group flex h-full cursor-pointer flex-col justify-center rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2 font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                  <PlusCircle className="h-5 w-5" />
                  Contribute or Report a Fix
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                  Notice missing information or an outdated procedure? Help your
                  fellow citizens by updating the directory.
                </p>
                <div className="mt-auto block w-full rounded-lg border border-slate-200 bg-white py-2.5 text-center text-sm font-bold text-slate-700 shadow-sm transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700">
                  Submit Information
                </div>
              </div>
            </>
          ) : (
            /* Empty State - Span across all columns */
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                No services found
              </h3>
              <p className="mx-auto max-w-sm text-sm text-slate-500">
                We couldn&apos;t find any services matching &ldquo;{searchQuery}
                &rdquo; in {selectedCategory}.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </FilterGrid.Content>
      </FilterGrid>

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
      />
    </main>
  );
}

export default function ServicesClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]"></div>}>
      <ServicesDirectoryContent />
    </Suspense>
  );
}
