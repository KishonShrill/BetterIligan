import { Phone, LifeBuoy, Flame, Shield, Cross } from "lucide-react";
import { telHref } from "./facilityMeta";
import WeatherBanner from "./WeatherBanner";

// The most time-critical numbers, surfaced above everything else so a resident
// can call in one tap without reading. All values mirror verified entries in the
// hotlines directory below (hotlines.json).
const QUICK_CONTACTS: {
    label: string;
    number: string;
    Icon: typeof Phone;
    color: string;
}[] = [
    { label: "Rescue / CDRRMO", number: "811", Icon: LifeBuoy, color: "#059669" },
    { label: "Fire", number: "160", Icon: Flame, color: "#ea580c" },
    { label: "Police", number: "167", Icon: Shield, color: "#2563eb" },
    { label: "Ambulance", number: "221-0081", Icon: Cross, color: "#dc2626" },
];

export default function EmergencyQuickCall() {
    return (
        <section aria-label="Emergency quick call" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* Hero 911 tile — big anchor of the bento. Signature 3D button
                treatment (see components/ui/Button3D), in danger red. */}
            <a
                href={telHref("911")}
                className="group col-span-2 flex flex-col items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-6 text-center text-white shadow-[0_4px_0_0_#7f1d1d] transition-all duration-150 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_8px_0_0_#7f1d1d] active:translate-y-1 active:shadow-[0_0px_0_0_#7f1d1d] lg:row-span-2 lg:py-10"
            >
                <Phone className="h-8 w-8 shrink-0 lg:h-12 lg:w-12" aria-hidden />
                <span className="text-xl font-extrabold tracking-tight lg:text-3xl">
                    Emergency? Call 911
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                    Tap to dial now
                </span>
            </a>

            {QUICK_CONTACTS.map(({ label, number, Icon, color }) => (
                <a
                    key={label}
                    href={telHref(number)}
                    className="group flex h-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                    <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${color}1a` }}
                    >
                        <Icon className="h-6 w-6" style={{ color }} aria-hidden />
                    </span>
                    <span className="flex min-w-0 flex-col leading-tight">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {label}
                        </span>
                        <span className="whitespace-nowrap text-base font-extrabold text-slate-900 sm:text-lg">
                            {number}
                        </span>
                    </span>
                </a>
            ))}

            {/* Wide base tile — live weather / storm advisory. */}
            <div className="col-span-2 lg:col-span-4">
                <WeatherBanner />
            </div>
        </section>
    );
}
