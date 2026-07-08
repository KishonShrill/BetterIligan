import { Waves, Mountain, Wind } from "lucide-react";

export type HazardKey = "flood" | "landslide" | "stormsurge";

// Hazard overlays sourced from UP NOAH (project-noah-hazard-maps, ODbL),
// clipped to Iligan and served on demand. `lvl` 1/2/3 = Low/Medium/High.
export const HAZARDS: Record<
    HazardKey,
    {
        label: string;
        legend: string;
        url: string;
        icon: typeof Waves;
        colors: [string, string, string];
    }
> = {
    flood: {
        label: "Flood risk",
        legend: "100-yr Flood Susceptibility",
        url: "/data/disaster/flood-100yr.geojson",
        icon: Waves,
        colors: ["#93c5fd", "#3b82f6", "#1d4ed8"],
    },
    landslide: {
        label: "Landslide",
        legend: "Landslide Susceptibility",
        url: "/data/disaster/landslide.geojson",
        icon: Mountain,
        colors: ["#fcd34d", "#f59e0b", "#b45309"],
    },
    stormsurge: {
        label: "Storm surge",
        legend: "Storm Surge (Advisory 4)",
        url: "/data/disaster/stormsurge-ssa4.geojson",
        icon: Wind,
        colors: ["#5eead4", "#14b8a6", "#0f766e"],
    },
};

export const HAZARD_ORDER: HazardKey[] = ["flood", "landslide", "stormsurge"];

export const HAZARD_SOURCE = { name: "UP NOAH", url: "https://noah.up.edu.ph/", license: "ODbL" };
