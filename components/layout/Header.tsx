"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
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

type ClassName = { className?: string };

export default function Header({ className }: ClassName) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const hideHeader = HIDDEN_HEADER_PATHS.includes(pathname);

  // Prevent background scrolling when mobile menu is open
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleAccordion = (name: string | null) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  return (
    <header
      className={`${className} ${hideHeader && "hidden"} sticky top-0 z-40 w-full border-b border-slate-200 bg-white px-4 font-sans`}
    >
      <div className={`p-0} relative container mx-auto`}>
        <div className="flex h-20 items-center justify-between sm:px-4">
          {/* Logo area */}
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
              >
                BetterIliganCity
              </Link>
              <span className="text-xs text-slate-500">
                A community-run portal for Iliganons
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden h-fit items-center gap-2 lg:flex">
            {pathname !== "/" && (
              <div className="group relative flex h-full items-center">
                <Link
                  href="/"
                  className="mr-4 flex items-center gap-1 py-2 text-base font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  <span className="relative py-1">
                    Home
                    <span className="absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </Link>
              </div>
            )}

            {navigation.map((item) => (
              <div
                key={item.name}
                className="group relative flex h-full items-center"
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 py-2 text-base font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  <span className="relative py-1">
                    {item.name}
                    <span className="absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
                </Link>

                {/* Desktop Dropdown */}
                <div className="invisible absolute top-full left-0 w-70 origin-top -translate-y-2 transform rounded-lg border border-slate-200 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="py-2">
                    {[...item.dropdown].map((subItem, idx) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block px-5 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 ${idx === 0 ? "mb-1 border-b border-slate-100 font-semibold lg:hidden" : ""}`}
                        >
                          {subItem.name}{" "}
                          {subItem.upcoming && (
                            <b className="text-red-700">(Coming Soon)</b>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>

          {/* Right side actions */}
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
              className="rounded-lg border border-slate-200 bg-white/95 p-2 text-slate-700 shadow-lg shadow-slate-300/30 backdrop-blur hover:bg-slate-700 hover:text-white active:translate-y-0 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {pathname != "/" && (
          <Breadcrumbs className="mx-auto w-fit border-slate-200 bg-white pb-2 md:absolute md:rounded-b-2xl md:border-x md:border-b md:p-2" />
        )}
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-2 fade-in absolute top-full left-0 flex max-h-[calc(100vh-81.1px-33.1px)] w-full flex-col items-center border-t border-t-gray-100 bg-white shadow-xl duration-200 lg:hidden">
          {/* Mobile Navigation Links - Scrollable area */}
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
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${activeAccordion === item.name ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mobile Dropdown (Accordion Content) */}
                {activeAccordion === item.name && (
                  <ul className="animate-in slide-in-from-top-2 fade-in border-l-2 border-blue-100 bg-gray-100 p-4 duration-200">
                    {[...item.dropdown].map((subItem, idx) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block py-2 pl-4 text-base hover:bg-gray-200 hover:text-blue-600 ${idx === 0 ? "font-semibold text-blue-600" : "text-slate-600"}`}
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

          {/* Mobile Bottom Info Bar - Pinned at the bottom of the dropdown */}
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
