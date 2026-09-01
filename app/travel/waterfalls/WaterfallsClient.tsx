"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Navigation,
  ExternalLink,
  Ruler,
  Droplets,
} from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import type { Waterfall } from "@/validations/waterfallSchema";

const REFERENCES = [
  {
    title: "Traveler's Tour — The 23 Majestic Waterfalls of Iligan City",
    url: "https://travelerstourdotcom.wordpress.com/2018/05/10/the-23-majestic-waterfalls-of-iligan-city-the-tourist-destination/",
  },
  {
    title: "GoIligan — Iligan City Waterfalls: A Complete Guide",
    url: "https://goiligan.com/iligan-city-waterfalls-complete-guide-20-hidden-gems/",
  },
  {
    title: "OpenStreetMap — Iligan City boundary & waterfall locations",
    url: "https://www.openstreetmap.org/relation/3818838",
  },
];

const WaterfallsMap = dynamic(() => import("./WaterfallsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full animate-pulse items-center justify-center bg-slate-100 font-medium text-slate-500">
      Loading map…
    </div>
  ),
});

function mapsUrl(f: Waterfall) {
  return `https://www.google.com/maps/dir/?api=1&destination=${f.lat}%2C${f.lon}`;
}

export default function WaterfallsClient({ falls }: { falls: Waterfall[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return falls;
    return falls.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.area ?? "").toLowerCase().includes(q) ||
        (f.description ?? "").toLowerCase().includes(q),
    );
  }, [falls, query]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/travel" text="Back to Travel" />
      <SubpageHero>
        <SubpageHero.Title>Waterfalls</SubpageHero.Title>
        <SubpageHero.Description>
          The falls that give Iligan its name — the City of Majestic Waterfalls.
          Locations, photos, and directions for each.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="container mx-auto space-y-8 px-4 py-8 md:px-6">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="h-[380px] w-full">
            <WaterfallsMap falls={falls} />
          </div>
        </div>

        <div className="relative max-w-md">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search waterfalls…"
            aria-label="Search waterfalls"
            className="w-full rounded-lg border border-slate-200 py-2.5 pr-3 pl-9 text-sm shadow-sm focus:ring-2 focus:ring-cyan-200 focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((f) => (
            <article
              key={f.name}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-4/3 bg-cyan-50">
                {f.photo ? (
                  <Image
                    src={f.photo.url}
                    alt={f.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized={f.photo.url.startsWith(
                      "https://upload.wikimedia.org/",
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-600/70">
                    <Droplets className="h-10 w-10" aria-hidden />
                    <span className="mt-1 text-xs font-semibold">
                      Photo needed
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-slate-900">{f.name}</h2>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {f.area && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <MapPin className="h-3.5 w-3.5" aria-hidden /> {f.area}
                    </span>
                  )}
                  {f.height && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700">
                      <Ruler className="h-3.5 w-3.5" aria-hidden /> {f.height}
                    </span>
                  )}
                </div>

                {f.description ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {f.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={mapsUrl(f)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-cyan-700"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden />{" "}
                    Directions
                  </a>
                  {f.reference && (
                    <a
                      href={f.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Learn
                      more
                    </a>
                  )}
                </div>

                <div className="mt-3 space-y-0.5">
                  {f.photo && (
                    <p className="text-[10px] text-slate-400">
                      Photo:{" "}
                      <a
                        href={f.photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-slate-600"
                      >
                        {f.photo.credit}
                      </a>{" "}
                      · {f.photo.license}
                    </p>
                  )}
                  {f.source && (
                    <p className="text-[10px] text-slate-400">
                      Location:{" "}
                      <a
                        href={f.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-slate-600"
                      >
                        OpenStreetMap
                      </a>{" "}
                      · verified {f.verifiedAt}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-8 text-center text-slate-400">
            No waterfalls match “{query}”.
          </p>
        )}

        <ReferencesFooter
          references={REFERENCES}
          disclaimer="Waterfalls are drawn from OpenStreetMap and verified to fall within Iligan City's administrative boundary, then cross-checked against the local guides above. A few falls named in those guides are not yet mapped with coordinates, so they are omitted rather than guessed. Coordinates are approximate — always travel with a local guide, especially to the upland falls. Photos are from Wikimedia Commons and Flickr, credited per card under their respective licenses."
        />
      </div>
    </main>
  );
}
