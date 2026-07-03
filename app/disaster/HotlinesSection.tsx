import { disasterHotlines } from "@/data/disaster";
import type { Hotline } from "@/validations/disasterSchema";
import { Phone } from "lucide-react";

const CATEGORY_ORDER: Hotline["category"][] = [
    "government",
    "rescue",
    "medical",
    "fire",
    "police",
    "utility",
];

const CATEGORY_LABELS: Record<Hotline["category"], string> = {
    government: "Emergency & Government",
    rescue: "Rescue & Disaster Response",
    medical: "Medical",
    fire: "Fire",
    police: "Police",
    utility: "Utilities",
};

function telHref(display: string): string {
    return `tel:${display.replace(/[^+\d]/g, "")}`;
}

export default function HotlinesSection() {
    const grouped = CATEGORY_ORDER.map((category) => ({
        category,
        entries: disasterHotlines.filter((h) => h.category === category),
    })).filter((g) => g.entries.length > 0);

    return (
        <section aria-labelledby="hotlines-heading">
            <h2 id="hotlines-heading" className="text-2xl font-bold text-slate-900 mb-2">
                Emergency Hotlines
            </h2>
            <p className="text-slate-600 mb-6">
                Tap a number to call. Each entry lists where the number was
                published and when we last verified it.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                {grouped.map(({ category, entries }) => (
                    <div
                        key={category}
                        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                    >
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                            {CATEGORY_LABELS[category]}
                        </h3>
                        <ul className="space-y-4">
                            {entries.map((hotline) => (
                                <li key={hotline.name}>
                                    <p className="font-semibold text-slate-900">
                                        {hotline.name}
                                        {hotline.hours && (
                                            <span className="ml-2 text-xs font-normal text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                                                {hotline.hours}
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        {hotline.numbers.map((number) => (
                                            <a
                                                key={number}
                                                href={telHref(number)}
                                                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors"
                                            >
                                                <Phone className="w-3.5 h-3.5" aria-hidden />
                                                {number}
                                            </a>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Source:{" "}
                                        <a
                                            href={hotline.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-slate-600"
                                        >
                                            link
                                        </a>{" "}
                                        · verified {hotline.verifiedAt}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
