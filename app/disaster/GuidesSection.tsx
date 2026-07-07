import { disasterGuides } from "@/data/disaster";
import type { DisasterGuide } from "@/validations/disasterSchema";
import { CloudRain, Waves, Activity, ChevronDown } from "lucide-react";

const HAZARD_META: Record<
    DisasterGuide["hazard"],
    { label: string; subtitle: string; color: string; image: string; Icon: typeof CloudRain }
> = {
    typhoon: {
        label: "Typhoon",
        subtitle: "Signals, go-bags, and staying put safely",
        color: "#2563eb",
        image: "/images/disaster/typhoon.svg",
        Icon: CloudRain,
    },
    flood: {
        label: "Flood",
        subtitle: "Move to higher ground, avoid the water",
        color: "#0891b2",
        image: "/images/disaster/flood.svg",
        Icon: Waves,
    },
    earthquake: {
        label: "Earthquake",
        subtitle: "Duck, cover, hold — and after the shaking",
        color: "#d97706",
        image: "/images/disaster/earthquake.svg",
        Icon: Activity,
    },
};

const PHASES = ["before", "during", "after"] as const;
const PHASE_LABELS: Record<(typeof PHASES)[number], string> = {
    before: "Before",
    during: "During",
    after: "After",
};

export default function GuidesSection() {
    return (
        <section aria-labelledby="guides-heading">
            <h2 id="guides-heading" className="text-2xl font-bold text-slate-900 mb-2">
                What to do: Preparedness Guides
            </h2>
            <p className="text-slate-600 mb-6">
                Simple checklists for before, during, and after each hazard —
                adapted from NDRRMC and Philippine Red Cross public guidance.
            </p>

            <div className="space-y-4">
                {disasterGuides.map((guide, i) => {
                    const { label, subtitle, color, image, Icon } = HAZARD_META[guide.hazard];
                    return (
                        <details
                            key={guide.hazard}
                            open={i === 0}
                            className="group bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                        >
                            <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                {/* Themed illustration header with the hazard title overlaid. */}
                                <div className="relative h-28 sm:h-32 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image}
                                        alt=""
                                        aria-hidden
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                                    <div className="relative flex h-full items-end gap-3 p-4">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                                            <Icon className="w-5 h-5 text-white" aria-hidden />
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-lg font-extrabold text-white drop-shadow-sm">{label}</span>
                                            <span className="block text-xs text-white/85 drop-shadow-sm">{subtitle}</span>
                                        </span>
                                        <ChevronDown
                                            className="w-5 h-5 shrink-0 text-white/90 transition-transform group-open:rotate-180"
                                            aria-hidden
                                        />
                                    </div>
                                </div>
                            </summary>
                            <div className="px-5 pb-6 pt-1 grid gap-6 md:grid-cols-3 border-t border-slate-100">
                                {PHASES.map((phase) => (
                                    <div key={phase}>
                                        <h3
                                            className="text-xs font-bold uppercase tracking-wider mb-3 pt-4"
                                            style={{ color }}
                                        >
                                            {PHASE_LABELS[phase]}
                                        </h3>
                                        <ul className="space-y-2">
                                            {guide.phases[phase].map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2"
                                                    style={{ borderColor: `${color}40` }}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </details>
                    );
                })}
            </div>
        </section>
    );
}
