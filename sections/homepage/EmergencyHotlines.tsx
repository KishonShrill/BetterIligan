import {
    Phone,
    LifeBuoy,
    Flame,
    Shield,
    Cross,
    ArrowUpRight,
} from "lucide-react";
import Section from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import Button3D from "@/components/ui/Button3D";

// Iligan-published landlines are 7-digit local numbers; prepend the area code so
// tap-to-call routes from mobile. Numbers mirror the /disaster hotlines.
function telHref(display: string): string {
    const cleaned = display.replace(/[^+\d]/g, "");
    return `tel:${cleaned.length === 7 ? `063${cleaned}` : cleaned}`;
}

const CONTACTS = [
    { label: "National Emergency", number: "911", Icon: Phone, color: "#dc2626" },
    { label: "Rescue / CDRRMO", number: "811", Icon: LifeBuoy, color: "#059669" },
    { label: "Fire Department", number: "160", Icon: Flame, color: "#ea580c" },
    { label: "Police Department", number: "167", Icon: Shield, color: "#2563eb" },
    { label: "Ambulance", number: "221-0081", Icon: Cross, color: "#dc2626" },
];

export default function EmergencyHotlines() {
    return (
        <Section className="border-t border-blue-100/50 bg-blue-50">
            {/* Header Block matching CityStats Layout */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end md:gap-4">
                <div className="text-left">
                    <p className="mb-1.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase md:mb-2 md:text-xs">
                        Emergency Services
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Emergency Hotlines
                    </h2>
                    <Text
                        className="mt-2 max-w-xl text-sm text-slate-500 md:text-base"
                        size="md"
                    >
                        Save these before you need them. Tap any number to call instantly from your mobile device.
                    </Text>
                </div>

                {/* CTA Button */}
                <Button3D
                    text="Disaster Preparedness Hub"
                    href="/disaster"
                    hasArrow={true}
                    size="sm"
                    variant="blue"
                />
            </div>

            {/* Main Hotlines Grid matching CityStats card structure */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
                {CONTACTS.map(({ label, number, Icon, color }) => (
                    <a
                        key={label}
                        href={telHref(number)}
                        aria-label={`Call ${label} at ${number}`}
                        className="relative bg-white border border-blue-100/50 shadow-sm rounded-2xl p-5 md:p-6 flex flex-col hover:shadow-md hover:border-blue-300 transition-all duration-200 group h-full block"
                    >
                        <div className="absolute top-5 right-5 text-slate-300 transition-colors duration-200 group-hover:text-blue-500">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>

                        <div className="mb-3 flex items-center gap-4 md:mb-4 md:block md:w-fit">
                            <div
                                className="rounded-xl border p-2.5 shrink-0"
                                style={{ backgroundColor: `${color}1a`, borderColor: `${color}33` }}
                            >
                                <Icon className="h-5 w-5" style={{ color }} aria-hidden />
                            </div>
                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase md:hidden">
                                {label}
                            </p>
                        </div>

                        <p className="mb-1 hidden text-xs font-bold tracking-wider text-slate-400 uppercase md:block">
                            {label}
                        </p>
                        <div className="flex justify-between">
                            <h3 className="mb-1 text-xl md:text-2xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                                {number}
                            </h3>
                            <p className="sm:mt-auto sm:pt-2 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Tap to call
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </Section>
    );
}
