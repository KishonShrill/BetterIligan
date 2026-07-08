import { disasterHotlines } from "@/data/disaster";
import type { Hotline } from "@/validations/disasterSchema";
import { Phone, Building2, LifeBuoy, Cross, Flame, Shield, Zap, ExternalLink, ArrowRight } from "lucide-react";

const CATEGORY_ORDER: Hotline["category"][] = [
    "government",
    "rescue",
    "medical",
    "fire",
    "police",
    "utility",
];

const CATEGORY_META: Record<
    Hotline["category"],
    { label: string; color: string; Icon: typeof Phone }
> = {
    government: { label: "Emergency & Government", color: "#4f46e5", Icon: Building2 },
    rescue: { label: "Rescue & Disaster Response", color: "#059669", Icon: LifeBuoy },
    medical: { label: "Medical", color: "#dc2626", Icon: Cross },
    fire: { label: "Fire", color: "#ea580c", Icon: Flame },
    police: { label: "Police", color: "#2563eb", Icon: Shield },
    utility: { label: "Utilities", color: "#475569", Icon: Zap },
};

function telHref(display: string): string {
    const cleaned = display.replace(/[^+\d]/g, "");
    // LGU-published landlines are 7-digit local numbers; prepend the Iligan
    // area code so tap-to-call routes from mobile phones.
    return `tel:${cleaned.length === 7 ? `063${cleaned}` : cleaned}`;
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
                Tap any number to call. Short codes like 811 or 160 work inside
                Iligan; from outside the city, use the full landline or mobile
                numbers.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                {grouped.map(({ category, entries }) => {
                    const { label, color, Icon } = CATEGORY_META[category];
                    return (
                    <div
                        key={category}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
                    >
                        <h3 className="flex items-center gap-2.5 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                            <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${color}1a` }}
                            >
                                <Icon className="w-4 h-4" style={{ color }} aria-hidden />
                            </span>
                            {label}
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
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {hotline.numbers.map((number) => (
                                            <a
                                                key={number}
                                                href={telHref(number)}
                                                className="inline-flex items-center gap-1.5 text-base font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg px-4 py-2.5 transition-colors"
                                            >
                                                <Phone className="w-4 h-4" aria-hidden />
                                                {number}
                                            </a>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
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
                    );
                })}
            </div>

            {/* Curated, maintained full directory from the BetterGov project. */}
            <a
                href="https://hotlines.bettergov.ph/?city=iligan+city&province=lanao+del+norte"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <ExternalLink className="h-6 w-6 text-blue-600" aria-hidden />
                </span>
                <span className="flex-1">
                    <span className="block font-bold text-slate-900">See the full hotline directory</span>
                    <span className="block text-sm text-slate-500">
                        A complete, regularly-maintained list for Iligan City, curated by BetterGov.ph.
                    </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" aria-hidden />
            </a>
        </section>
    );
}
