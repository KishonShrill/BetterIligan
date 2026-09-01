import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { serviceCategories } from "@/data/categories";
import SubpageHero from "@/components/ui/SubpageHero";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Complete sitemap of BetterIliganCity.org - find all pages, services, and resources for Iligan City.",
};

interface SitemapLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

const sections: SitemapSection[] = [
  {
    title: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Volunteer", href: "/volunteer" },
    ],
  },
  {
    title: "Iligan City",
    links: [
      { label: "All About Iligan", href: "/iligan" },
      { label: "City Profile & Stats", href: "/iligan/city-stats" },
      { label: "City Officials", href: "/iligan/city-officials" },
      { label: "Barangays", href: "/iligan/barangays" },
      { label: "Electricity", href: "/iligan/electricity" },
    ],
  },
  {
    title: "Travel",
    links: [
      {
        label: "Explore Travel",
        href: "travel",
      },
      {
        label: "Transportation Guide",
        href: "/travel/transportation",
      },
      {
        label: "Jeepney Routes",
        href: "/travel/transportation/jeepney",
      },
      {
        label: "Bus Schedules",
        href: "/travel/transportation/bus",
      },
      {
        label: "Waterfalls",
        href: "/travel/waterfalls",
      },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", href: "/services" },
      ...serviceCategories.map((category) => ({
        label: category.name,
        href: category.href,
      })),
    ],
  },
  {
    title: "Government",
    links: [
      { label: "Government Overview", href: "/government" },
      { label: "National Agencies", href: "/government/directory" },
      { label: "Departments", href: "/government/departments" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { label: "Transparency Overview", href: "/transparency" },
      { label: "Budget & Finances", href: "/transparency/budget" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Open Data", href: "/open-data" },
      {
        label: "iligan.gov.ph",
        href: "https://iligan.gov.ph/",
        external: true,
      },
    ],
  },
];

function SitemapLinkItem({ link }: { link: SitemapLink }) {
  const className =
    "text-sm text-slate-600 hover:text-blue-600 transition-colors";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label} ↗
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageHero>
        <SubpageHero.Badges>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </SubpageHero.Badges>
        <SubpageHero.Title>Sitemap</SubpageHero.Title>
        <SubpageHero.Description>
          Find every page on BetterIliganCity.org, organized by section.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[800px] px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <SitemapLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
