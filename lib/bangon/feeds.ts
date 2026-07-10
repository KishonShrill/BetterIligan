import { FeedItemSchema, type FeedItem } from "@/validations/bangonSchema";

// Feed adapters for the Bangon Iligan ingester. Each adapter fetches a trusted
// external source and returns normalized FeedItem[] (deduped upstream by
// source + externalId). New sources — PAGASA, NDRRMC, Facebook Graph for
// admin'd pages — plug in as additional adapters exported from here.

// Bounding box around Mindanao / the southern Philippines. Iligan sits at
// ~8.23N, 124.25E; this window catches the regional seismicity that matters
// locally without pulling the whole country.
const MINDANAO_BBOX = { minLat: 5, maxLat: 12, minLon: 120, maxLon: 128 };

interface UsgsFeature {
    id: string;
    properties: { mag: number | null; place: string | null; time: number | null; url: string | null; title: string | null };
    geometry: { coordinates: [number, number, number] } | null;
}

/**
 * USGS earthquakes near Mindanao since `sinceIso`, magnitude >= `minMagnitude`.
 * USGS FDSN is an official, free, no-auth GeoJSON API.
 */
export async function fetchUsgsEarthquakes(sinceIso: string, minMagnitude = 4): Promise<FeedItem[]> {
    const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
    url.searchParams.set("format", "geojson");
    url.searchParams.set("starttime", sinceIso);
    url.searchParams.set("minmagnitude", String(minMagnitude));
    url.searchParams.set("minlatitude", String(MINDANAO_BBOX.minLat));
    url.searchParams.set("maxlatitude", String(MINDANAO_BBOX.maxLat));
    url.searchParams.set("minlongitude", String(MINDANAO_BBOX.minLon));
    url.searchParams.set("maxlongitude", String(MINDANAO_BBOX.maxLon));
    url.searchParams.set("orderby", "time");

    const res = await fetch(url, { headers: { "User-Agent": "BetterIligan/bangon-ingester" } });
    if (!res.ok) throw new Error(`USGS request failed: ${res.status}`);
    const data = (await res.json()) as { features?: UsgsFeature[] };

    return (data.features ?? []).flatMap((f) => {
        const p = f.properties;
        if (p.time == null) return [];
        const mag = p.mag ?? undefined;
        const place = p.place ?? "Unknown location";
        const item = {
            source: "usgs",
            externalId: f.id,
            category: "Earthquake",
            title: p.title ?? `M ${mag ?? "?"} — ${place}`,
            summary: `Magnitude ${mag ?? "?"} earthquake · ${place}`,
            url: p.url ?? undefined,
            magnitude: mag,
            publishedAt: new Date(p.time).toISOString(),
        };
        const parsed = FeedItemSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
    });
}

// Runs every configured adapter, tolerating individual source failures so one
// bad feed never blocks the others. Returns the merged, validated items.
export async function collectFeedItems(sinceIso: string): Promise<FeedItem[]> {
    const adapters: Array<Promise<FeedItem[]>> = [fetchUsgsEarthquakes(sinceIso)];
    const settled = await Promise.allSettled(adapters);
    const items: FeedItem[] = [];
    for (const r of settled) {
        if (r.status === "fulfilled") items.push(...r.value);
        else console.error("feed adapter failed:", r.reason);
    }
    return items;
}
