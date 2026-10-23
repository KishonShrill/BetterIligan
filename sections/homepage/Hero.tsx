"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUpRight,
  FileText,
  Landmark,
  X,
  Sparkles,
  Zap,
  Bus,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Section from "@/components/ui/Section";
import Button3D from "@/components/ui/Button3D";

// Import your centralized services array!
import { allServices } from "@/data/services";
import { AllService } from "@/validations/serviceSchema";

const QUICK_LINKS = [
  {
    title: "Mugna Festival",
    description: "Event schedules & guides",
    href: "/travel/mugna",
    Icon: Sparkles,
    badge: "Featured",
  },
  {
    title: "Electricity Rate",
    description: "Power schedules & advisories",
    href: "/iligan/electricity#ilpi",
    Icon: Zap,
  },
  {
    title: "Jeepney Routes",
    description: "City-wide routes & fares",
    href: "/travel/transportation/jeepney",
    Icon: Bus,
  },
  {
    title: "Emergency",
    description: "Disaster recovery & alerts",
    href: "/bangon-iligan",
    Icon: ShieldAlert,
  },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AllService[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // NEW STATE: Controls whether the full search card is visible on mobile
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  // Reference to the search container to detect clicks outside
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Handle the filtering logic whenever the query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allServices
        .filter(
          (service) =>
            service.title.toLowerCase().includes(lowerCaseQuery) ||
            service.description.toLowerCase().includes(lowerCaseQuery) ||
            service.category.toLowerCase().includes(lowerCaseQuery) ||
            service.tags?.some((tag) =>
              tag.toLowerCase().includes(lowerCaseQuery),
            ),
        )
        .slice(0, 10); // Limit to top 10 results

      setSearchResults(filtered);
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchQuery]);

  // Handle clicks outside the search component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When mobile search opens, automatically focus the input
  useEffect(() => {
    if (isMobileSearchVisible && mobileSearchInputRef.current) {
      // Small delay to allow the animation to render first
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isMobileSearchVisible]);

  // Helper to handle popular search clicks
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    // If they click a popular search on mobile BEFORE opening the search box,
    // open the search box so they can see the results!
    if (!isMobileSearchVisible && window.innerWidth < 1024) {
      setIsMobileSearchVisible(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsDropdownOpen(false);

      if (searchQuery.trim()) {
        router.push(`/services?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push("/services");
      }
    }
  };

  return (
    <Section className="bg-[#0038A8] max-md:py-3">
      {/* Subtle Background Grid for texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]"></div>

      <div className="relative mx-auto grid w-full max-w-404 grid-cols-1 items-center gap-4 py-8 md:gap-8 md:py-12 lg:grid-cols-2">
        {/* Left Column */}
        <div className="mx-auto max-w-404 text-center lg:mx-0 lg:text-left">
          <h1 className="mb-3 text-4xl leading-tight font-extrabold tracking-tight text-white min-[767px]:text-5xl md:leading-[1.1] lg:text-left xl:text-6xl">
            Welcome to <br /> BetterIliganCity.org
          </h1>

          <p
            className={`text-base text-blue-100 lg:max-w-lg lg:text-left lg:text-lg ${!isMobileSearchVisible ? "mb-6" : "mb-3"} leading-relaxed`}
          >
            A modernized, volunteer-driven portal to access government services,
            public data, and resources for the people of Iligan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            {!isMobileSearchVisible && (
              <Button3D
                text="Browse Services"
                href="/services"
                hasArrow={true}
                variant="white"
                size="md"
                className="w-fit max-sm:mx-auto sm:w-auto"
              />
            )}

            {/* NEW: The Mobile Reveal Search Button! Hidden on Desktop (lg) */}
            {!isMobileSearchVisible && (
              <Button3D
                text="Find a Service"
                icon={Search}
                iconPosition="left"
                onClick={() => setIsMobileSearchVisible(true)}
                variant="blue"
                size="md"
                className="w-fit max-sm:mx-auto sm:w-auto lg:hidden"
              />
            )}
          </div>
        </div>

        {/* Right Column - Dynamic Search Card */}
        {/* Notice the conditional class handling: It's always visible on 'lg', but toggled by state on mobile */}
        <div
          className={`z-10 mx-auto w-full max-lg:max-w-2xl lg:mx-0 lg:ml-auto ${!isMobileSearchVisible ? "max-lg:hidden" : "max-lg:animate-in max-lg:fade-in max-lg:slide-in-from-bottom-4 max-lg:duration-300"}`}
        >
          {/* The main Search Card UI */}
          <div className="relative rounded-xl border border-white/20 p-5 shadow-lg max-lg:bg-white/10 max-lg:backdrop-blur-md md:rounded-2xl md:border-slate-100 md:bg-white md:p-8 md:shadow-2xl">
            {/* Card Header & Mobile Close Button */}
            <div className="mb-5 flex items-center justify-between md:mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-2.5 md:rounded-lg md:bg-blue-100 md:p-2">
                  <Search className="h-5 w-5 text-white md:text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-white md:text-slate-800">
                  Find a Service
                </h2>
              </div>

              {/* Mobile Close Button (X) */}
              <button
                onClick={() => {
                  setIsMobileSearchVisible(false);
                  setSearchQuery(""); // Optional: clear search when closing
                }}
                className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Input & Dropdown Container */}
            <div
              className="group relative mb-6 md:mb-8"
              ref={searchContainerRef}
            >
              <input
                ref={mobileSearchInputRef} // Added ref for auto-focus
                type="text"
                placeholder="e.g., birth certificate, business permit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setIsDropdownOpen(true)
                }
                onKeyDown={handleKeyDown}
                className="relative z-10 w-full rounded-xl border-2 border-transparent bg-white py-4 pr-16 pl-4 text-base text-slate-900 shadow-xl transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none md:border-slate-100 md:bg-slate-50 md:pr-14 md:shadow-none"
              />

              {/* Search Submit Button */}
              <Link
                href={`/services?q=${encodeURIComponent(searchQuery)}`}
                aria-label="Search"
                className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 items-center justify-center rounded-lg bg-blue-600 p-3 text-white shadow-sm transition-colors hover:bg-blue-700 md:p-2.5"
              >
                <ArrowUpRight className="h-5 w-5 md:h-4 md:w-4" />
              </Link>

              {/* FLOATING DROPDOWN RESULTS */}
              {isDropdownOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl duration-200">
                  {searchResults.length > 0 ? (
                    <ul className="custom-scrollbar max-h-[50vh] divide-y divide-slate-100 overflow-y-auto p-1 md:max-h-80">
                      {searchResults.map((service, idx) => (
                        <li key={`service-${idx}`}>
                          <Link
                            href={
                              service.type === "external"
                                ? service.externalUrl
                                : service.type === "custom_link"
                                  ? service.href // <-- Routes directly to your custom path
                                  : service.type === "internal" &&
                                      !service.internalUrl
                                    ? `/community/${service.slug}`
                                    : service.type === "internal" &&
                                        service.internalUrl
                                      ? service.internalUrl
                                      : `/services/${service.slug}`
                            }
                            className="group/item flex items-center justify-between rounded-lg p-3 transition-all hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset md:p-4"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className="flex flex-col">
                              <span className="mb-0.5 text-base font-bold text-slate-900 transition-colors group-hover/item:text-blue-700 group-focus/item:text-blue-700 md:text-sm">
                                {service.title}
                              </span>
                              <span className="mb-0.5 text-xs text-slate-500 md:text-xs">
                                {service.type !== "internal" &&
                                  service.type !== "custom_link" &&
                                  `${service.department} • `}{" "}
                                {service.category}
                              </span>
                              <span className="line-clamp-1 text-xs text-blue-700 md:text-sm">
                                {service.type === "standard"
                                  ? `betteriligancity.org/services/${service.slug}`
                                  : service.type === "internal"
                                    ? `betteriligancity.org/community/${service.slug}`
                                    : service.type === "custom_link"
                                      ? `betteriligancity.org${service.href}` // <-- Displays the custom path
                                      : service.externalUrl}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No services found matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Popular Searches */}
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-blue-200 uppercase md:text-slate-400">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Birth Certificate", icon: FileText },
                  { name: "Marriage Certificate", icon: FileText },
                  { name: "Business Permit", icon: Landmark },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handlePopularSearch(item.name)}
                    className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:border-slate-100 md:bg-slate-50 md:text-slate-600 md:backdrop-blur-none md:hover:bg-blue-50 md:hover:text-blue-700"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="relative mx-auto w-full max-w-404 pt-3 md:pt-6 lg:col-span-2">
          <div className="mb-6 max-lg:hidden">
            <h2 className="text-xl font-extrabold text-white md:text-2xl">
              Quick Access
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Direct links to Iligan's most frequently used tools and current
              events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {QUICK_LINKS.map(({ title, description, href, Icon, badge }) => (
              <Link
                key={title}
                href={href}
                className="group relative z-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/40 hover:bg-white/20 md:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 md:h-12 md:w-12">
                    <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
                  </div>
                  {badge && (
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
                      {badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-bold text-white transition-colors group-hover:text-blue-200 md:text-base">
                    {title}
                  </h3>
                  <p className="mb-3 line-clamp-1 text-xs text-blue-100 md:line-clamp-2 md:text-sm">
                    {description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 group-hover:text-white md:text-sm">
                  View More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
