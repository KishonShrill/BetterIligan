"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { HIDDEN_HEADER_PATHS } from "@/utils/variables";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

type ClassName = { className?: string };

const footerSections: FooterSection[] = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Open Data", href: "/open-data" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", href: "/services" },
      { label: "Disaster Preparedness", href: "/disaster" },
      {
        label: "Business and Trade",
        href: "/services?category=Business%2C+Trade+and+Investment",
      },
      {
        label: "Certificates and Vital Records",
        href: "/services?category=Certificates+and+Vital+Records",
      },
      { label: "Health", href: "/services?category=Health+and+Wellness" },
    ],
  },
  {
    title: "Government",
    links: [
      { label: "City Officials", href: "/government" },
      { label: "Departments", href: "/government/departments" },
      { label: "Barangays", href: "/iligan/barangays" },
      { label: "Transparency", href: "#" },
    ],
  },
  {
    title: "Official",
    links: [
      {
        label: "iligan.gov.ph",
        href: "https://iligan.gov.ph/",
        external: true,
      },
    ],
  },
];

export default function Footer({ className }: ClassName) {
  const pathname = usePathname();
  const hideHeader = HIDDEN_HEADER_PATHS.includes(pathname);

  return (
    <footer
      className={`${className} ${hideHeader && "hidden"} overflow-hidden bg-slate-900 font-sans text-white`}
    >
      <div className="container mx-auto flex min-h-full flex-col px-4 pt-16 pb-8">
        {/* Description & Socials nested right above the giant logo */}
        <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end md:mb-8">
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Open-source civic tech initiative making government information
            accessible for Iliganons.
          </p>
          <div className="flex shrink-0 gap-3">
            <a
              href="https://www.facebook.com/BetterIliganCity.org"
              className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/KishonShrill/BetterIligan"
              className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 1. TOP: Links Grid */}
        <div className="mb-16 grid grid-cols-2 gap-10 md:mb-24 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold text-slate-100">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* 2. MIDDLE: Description, Socials, and Expanding Branding */}
        <div className="mt-auto mb-8 flex flex-col border-b border-slate-800 pb-8">
          {/* The Dynamically Expanding Logo & Name */}
          <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
            <Image
              src="/images/logos/betteriligan-logo.png"
              alt="BetterIliganCity Logo"
              width={200}
              height={200}
              className="h-auto w-[12vw] max-w-[140px] min-w-[50px] shrink-0 rounded-xl object-cover select-none sm:rounded-2xl"
            />
            <div className="truncate text-right text-[clamp(2rem,9vw,10rem)] leading-none font-black tracking-tighter text-white select-none">
              BetterIliganCity
            </div>
          </div>
        </div>

        {/* 3. BOTTOM: Copyright & Sitemap */}
        <div>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-slate-500 sm:text-left">
              &copy; {new Date().getFullYear()} BetterIliganCity · Not an
              official government website
            </p>
            <Link
              href="/site-map"
              className="shrink-0 text-sm text-slate-500 transition-colors hover:text-white"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
