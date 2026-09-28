"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  ArrowRight,
  Map,
  Megaphone,
  FileText,
  Phone,
  Users,
  Building2,
  Landmark,
  Link2,
} from "lucide-react";

import { headerDropdown } from "@/data/categories";
import navigationJson from "@/data/navigation.json";
import Breadcrumbs from "../ui/Breadcrumbs";
import Button3D from "../ui/Button3D";
import { HIDDEN_HEADER_PATHS } from "@/utils/variables";

interface SubItem {
  name: string;
  description?: string;
  href: string;
  upcoming?: boolean;
}

interface Navigation {
  name: string;
  href: string;
  dropdown: SubItem[];
}

const navigation: Navigation[] = [
  ...navigationJson.slice(0, 2),
  {
    name: "Services",
    href: "/services",
    dropdown: headerDropdown,
  },
  ...navigationJson.slice(2),
];

type ClassName = {
  className?: string;
};

/**
 * Icons used by the mega menu.
 *
 * Since your existing navigation data doesn't currently contain icons,
 * we assign them based on the item name.
 */
const getMenuIcon = (name: string) => {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("transport") ||
    normalized.includes("travel") ||
    normalized.includes("jeep") ||
    normalized.includes("route")
  ) {
    return Map;
  }

  if (
    normalized.includes("report") ||
    normalized.includes("issue") ||
    normalized.includes("complaint")
  ) {
    return Megaphone;
  }

  if (
    normalized.includes("ordinance") ||
    normalized.includes("resolution") ||
    normalized.includes("document")
  ) {
    return FileText;
  }

  if (
    normalized.includes("hotline") ||
    normalized.includes("emergency") ||
    normalized.includes("contact")
  ) {
    return Phone;
  }

  if (normalized.includes("volunteer") || normalized.includes("community")) {
    return Users;
  }

  if (
    normalized.includes("government") ||
    normalized.includes("lgu") ||
    normalized.includes("service")
  ) {
    return Building2;
  }

  if (normalized.includes("project") || normalized.includes("development")) {
    return Landmark;
  }

  return Link2;
};

export default function Header({ className }: ClassName) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const hideHeader = HIDDEN_HEADER_PATHS.includes(pathname);

  const activeNavigation = useMemo(
    () => navigation.find((item) => item.name === activeDropdown),
    [activeDropdown],
  );

  // Prevent background scrolling when mobile menu is open.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveAccordion(null);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleAccordion = (name: string | null) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const handleDropdownEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  /*
   * The first 6 items are treated as "Popular".
   * Any remaining items are displayed in the "More" column.
   */
  const popularItems = activeNavigation?.dropdown.slice(0, 6) ?? [];
  const moreItems = activeNavigation?.dropdown.slice(6) ?? [];

  return (
    <header
      className={`${className ?? ""} ${
        hideHeader ? "hidden" : ""
      } sticky top-0 z-50 w-full border-b border-slate-200 bg-white font-sans`}
    >
      <div className="relative" onMouseLeave={closeDropdown}>
        {/* ===== DESKTOP / MAIN HEADER ===== */}
        <div className="relative container mx-auto">
          <div className="flex h-20 items-center justify-between sm:px-4">
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <Image
                src="/images/logos/betteriligan-logo.png"
                alt="BetterIligan Logo"
                width={75}
                height={75}
                loading="eager"
                className="h-12 w-12 object-cover sm:h-18 sm:w-18"
              />

              <div className="block leading-[0.25]">
                <Link
                  href="/"
                  className="block text-xl leading-tight font-bold text-slate-900"
                  onMouseEnter={closeDropdown}
                >
                  BetterIliganCity
                </Link>

                <span className="text-xs text-slate-500">
                  A community-run portal for Iliganons
                </span>
              </div>
            </div>

            {/* ===== DESKTOP NAVIGATION ===== */}
            <nav className="hidden h-full items-center gap-2 lg:flex">
              {/* Home */}
              {pathname !== "/" && (
                <div className="flex h-full items-center">
                  <Link
                    href="/"
                    onMouseEnter={closeDropdown}
                    className="mr-4 flex items-center gap-1 py-2 text-base font-medium text-slate-700 transition-colors hover:text-blue-600"
                  >
                    <span className="relative py-1">
                      Home
                      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-blue-600 transition-transform duration-300 hover:scale-x-100" />
                    </span>
                  </Link>
                </div>
              )}

              {navigation.map((item) => {
                const isActive = activeDropdown === item.name;

                return (
                  <div
                    key={item.name}
                    className="flex h-full items-center"
                    onMouseEnter={() => handleDropdownEnter(item.name)}
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-1 py-2 text-base font-medium transition-colors ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-700 hover:text-blue-600"
                      }`}
                    >
                      <span className="relative py-1">
                        {item.name}

                        <span
                          className={`absolute bottom-0 left-0 h-[2px] w-full origin-center bg-blue-600 transition-transform duration-300 ${
                            isActive
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ===== RIGHT SIDE ACTIONS ===== */}
            <div className="flex items-center gap-4">
              <Button3D
                href="/volunteer"
                text="Join Us!"
                variant="blue"
                size="sm"
                className="w-fit max-[470px]:hidden max-sm:mx-auto"
              />

              {/* Mobile menu button */}
              <button
                type="button"
                aria-label="Open main menu"
                aria-expanded={isMobileMenuOpen}
                className="rounded-lg border border-slate-200 bg-white/95 p-2 text-slate-700 shadow-lg shadow-slate-300/30 backdrop-blur transition-colors hover:bg-slate-700 hover:text-white active:translate-y-0 lg:hidden"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setActiveDropdown(null);
                }}
              >
                <span className="sr-only">Open main menu</span>

                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          {pathname !== "/" && (
            <Breadcrumbs className="mx-auto w-fit border-slate-200 bg-white pb-2 md:absolute md:rounded-b-2xl md:border-x md:border-b md:p-2" />
          )}
        </div>

        {/* ===== DESKTOP MEGA MENU ===== */}
        <div
          className={`absolute top-full left-0 z-50 hidden w-full border-t border-slate-100 bg-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.12)] transition-all duration-200 ease-out lg:block ${
            activeDropdown
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
          onMouseEnter={() => {
            if (activeNavigation) {
              setActiveDropdown(activeNavigation.name);
            }
          }}
        >
          {activeNavigation && (
            <div className="container mx-auto px-6">
              <div className="py-8">
                {/* ===== MAIN MENU GRID ===== */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Popular items */}
                  <div
                    className={
                      moreItems.length > 0 ? "col-span-7" : "col-span-9"
                    }
                  >
                    <p className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      Popular
                    </p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {popularItems.map((subItem, index) => {
                        if (index == 0) return;
                        const Icon = getMenuIcon(subItem.name);

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeDropdown}
                            className="group flex min-h-[82px] gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50"
                          >
                            {/* Icon */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-700">
                              <Icon className="h-5 w-5 text-blue-800 group-hover:text-white" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0 pt-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700 group-hover:underline">
                                  {subItem.name}
                                </span>

                                {subItem.upcoming && (
                                  <span className="text-[10px] font-bold tracking-wide text-red-600 uppercase">
                                    Soon
                                  </span>
                                )}
                              </div>

                              {subItem.description && (
                                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                                  {subItem.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===== MORE LINKS ===== */}
                  {moreItems.length > 0 && (
                    <div className="col-span-2 border-l border-slate-100 pl-8">
                      <p className="mb-5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        More
                      </p>

                      <div className="flex flex-col gap-4">
                        {moreItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeDropdown}
                            className="group text-sm font-medium text-slate-700 transition-colors hover:text-blue-700"
                          >
                            <span className="group-hover:underline">
                              {subItem.name}
                            </span>

                            {subItem.upcoming && (
                              <span className="ml-1 text-xs font-semibold text-red-600">
                                Soon
                              </span>
                            )}
                          </Link>
                        ))}

                        <Link
                          href={activeNavigation.href}
                          onClick={closeDropdown}
                          className="group mt-1 flex items-center gap-1 text-sm font-semibold text-blue-700"
                        >
                          View all
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* ===== CTA CARD ===== */}
                  <div className={"col-span-3"}>
                    <div className="h-full min-h-[190px] rounded-2xl bg-[#0b155c] p-6 text-white">
                      <div className="flex h-full flex-col">
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-semibold tracking-wider text-blue-200 uppercase">
                            BetterIliganCity
                          </p>

                          <h3 className="text-lg leading-tight font-bold">
                            Help make Iligan better
                          </h3>

                          <p className="mt-2 text-sm leading-5 text-blue-100">
                            Explore community services and help improve
                            information around our city.
                          </p>
                        </div>

                        <Button3D
                          href="/volunteer"
                          onClick={closeDropdown}
                          text="Join the community"
                          variant="blue"
                          size="sm"
                          className="mt-auto max-[470px]:hidden max-sm:mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-2 fade-in absolute top-full left-0 flex max-h-[calc(100vh-81.1px-33.1px)] w-full flex-col items-center border-t border-t-gray-100 bg-white shadow-xl duration-200 lg:hidden">
          {/* Mobile Navigation Links */}
          <div className="container flex h-fit flex-col gap-1 overflow-y-auto px-4 py-4">
            {pathname !== "/" && (
              <div className="border-b border-slate-100">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2 text-left text-lg font-medium text-slate-800 transition-colors hover:text-blue-600"
                >
                  Home
                </Link>
              </div>
            )}

            {navigation.map((item) => (
              <div
                key={item.name}
                className="border-b border-slate-100 last:border-0"
              >
                <button
                  onClick={() => toggleAccordion(item.name)}
                  className="flex w-full items-center justify-between py-2 text-left text-lg font-medium text-slate-800"
                >
                  {item.name}

                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      activeAccordion === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile Dropdown */}
                {activeAccordion === item.name && (
                  <ul className="animate-in slide-in-from-top-2 fade-in border-l-2 border-blue-100 bg-gray-100 p-4 duration-200">
                    {[...item.dropdown].map((subItem, idx) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block py-2 pl-4 text-base hover:bg-gray-200 hover:text-blue-600 ${
                            idx === 0
                              ? "font-semibold text-blue-600"
                              : "text-slate-600"
                          }`}
                        >
                          {subItem.name}{" "}
                          {subItem.upcoming && (
                            <b className="text-red-700">(Coming Soon)</b>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Bottom Info Bar */}
          <div className="w-full shrink-0 bg-[#1a2b4c] px-4 py-3 text-white">
            <div className="flex items-center justify-center gap-8 text-xs font-medium">
              <div className="flex flex-col items-center">
                <span className="opacity-70">ILIGAN</span>
                <span>31°C</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="opacity-70">CDO</span>
                <span>32°C</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="opacity-70">MANILA</span>
                <span>33°C</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
