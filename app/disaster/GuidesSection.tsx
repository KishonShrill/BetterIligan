import { disasterGuides } from "@/data/disaster";
import type { DisasterGuide } from "@/validations/disasterSchema";
import { CloudRain, Waves, Activity } from "lucide-react";

const HAZARD_META: Record<
    DisasterGuide["hazard"],
    { label: string; Icon: typeof CloudRain }
> = {
    typhoon: { label: "Typhoon", Icon: CloudRain },
    flood: { label: "Flood", Icon: Waves },
    earthquake: { label: "Earthquake", Icon: Activity },
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
                Preparedness Guides
            </h2>
            <p className="text-slate-600 mb-6">
                What to do before, during, and after — adapted from NDRRMC and
                Philippine Red Cross public guidance.
            </p>

            <div className="space-y-4">
                {disasterGuides.map((guide) => {
                    const { label, Icon } = HAZARD_META[guide.hazard];
                    return (
                        <details
                            key={guide.hazard}
                            className="group bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                        >
                            <summary className="flex items-center gap-3 cursor-pointer select-none px-6 py-4 font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                                <Icon className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
                                {label}
                                <span className="ml-auto text-slate-400 text-sm font-normal group-open:hidden">
                                    Show checklist
                                </span>
                            </summary>
                            <div className="px-6 pb-6 grid gap-6 md:grid-cols-3">
                                {PHASES.map((phase) => (
                                    <div key={phase}>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                                            {PHASE_LABELS[phase]}
                                        </h3>
                                        <ul className="space-y-2">
                                            {guide.phases[phase].map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-blue-100"
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
