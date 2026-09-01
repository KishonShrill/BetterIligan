import { MapPin } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import { disasterFacilities } from "@/data/disaster";
import { CATEGORY_META, CATEGORY_ORDER, type Category } from "./facilityMeta";

// Lean preview into the dedicated /disaster/map page. The heavy interactive map
// is deliberately kept off the hub so this page stays fast on a bad connection —
// but the preview visual makes it obvious there's a real map to open.
const PIN_POSITIONS = [
  { top: "28%", left: "16%" },
  { top: "58%", left: "30%" },
  { top: "22%", left: "58%" },
  { top: "64%", left: "72%" },
  { top: "44%", left: "46%" },
  { top: "74%", left: "20%" },
];

export default function FacilitiesSection() {
  const present = CATEGORY_ORDER.filter((c) =>
    disasterFacilities.some((f) => f.category === c),
  );
  const pinColors: Category[] = PIN_POSITIONS.map(
    (_, i) => present[i % present.length],
  );

  return (
    <section aria-labelledby="facilities-heading">
      <h2
        id="facilities-heading"
        className="mb-2 text-2xl font-bold text-slate-900"
      >
        Emergency Facilities Map
      </h2>
      <p className="mb-5 text-slate-600">
        Find the nearest hospital, fire or police station, utility office, or
        evacuation landmark across Iligan City.
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Map-preview hero — a faint street grid with category pins so it
                    unmistakably reads as an interactive map. */}
        <div
          className="relative h-44 sm:h-52"
          style={{
            backgroundColor: "#ecfdf5",
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.06) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        >
          {PIN_POSITIONS.map((pos, i) => (
            <MapPin
              key={i}
              className="absolute h-7 w-7 -translate-x-1/2 -translate-y-full drop-shadow"
              style={{
                top: pos.top,
                left: pos.left,
                color: CATEGORY_META[pinColors[i]].color,
                fill: "#fff",
              }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-bold text-slate-900">
              {disasterFacilities.length} emergency locations, mapped
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              Search, filter by type, and find what&apos;s nearest to you.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              {present.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_META[c].color }}
                  />
                  {CATEGORY_META[c].label}
                </span>
              ))}
            </div>
          </div>
          <Button3D
            text="Open the map"
            href="/disaster/map"
            variant="blue"
            icon={MapPin}
            iconPosition="left"
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
