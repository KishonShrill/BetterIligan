import Link from "next/link";
import {
    Users,
    Calendar,
    Map,
    Droplets,
    Layers,
    TrendingUp,
    Compass,
    ArrowUpRight,
} from "lucide-react";
import Section from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import Button3D from "@/components/ui/Button3D";

export default function CityStatsSummary() {
    const quickStats = [
        {
            icon: <Users className="h-5 w-5 text-blue-600" />,
            bgIcon: "bg-blue-50 border-blue-100",
            label: "Total Population",
            value: "368,132",
            subtext: "2024 Census • 452.60/km² density",
        },
        {
            icon: <Map className="h-5 w-5 text-emerald-600" />,
            bgIcon: "bg-emerald-50 border-emerald-100",
            label: "Land Area",
            value: "81,337 ha",
            subtext: "813.37 square kilometers",
        },
        {
            icon: <Droplets className="h-5 w-5 text-cyan-600" />,
            bgIcon: "bg-cyan-50 border-cyan-100",
            label: "Natural Wonders",
            value: "23 Waterfalls",
            subtext: "Plus 8 springs & 15 caves",
            href: "/travel/waterfalls",
        },
        {
            icon: <Layers className="h-5 w-5 text-purple-600" />,
            bgIcon: "bg-purple-50 border-purple-100",
            label: "Political Subdivisions",
            value: "44 Barangays",
            subtext: "Highly Urbanized City class",
            href: "/iligan/barangays",
        },
    ];

    return (
        <Section className="bg-blue-50">
            {/* Header Block */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end md:gap-4">
                <div className="text-left">
                    <p className="mb-1.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase md:mb-2 md:text-xs">
                        Iligan At A Glance
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        City Statistics & Profile
                    </h2>
                    <Text
                        className="mt-2 max-w-xl text-sm text-slate-500 md:text-base"
                        size="md"
                    >
                        From vital demographics to natural resources, explore the
                        foundational numbers that drive the City of Majestic Waterfalls.
                    </Text>
                </div>

                {/* CTA Button */}
                <Button3D
                    text="Explore Full City Profile"
                    href="/iligan/city-stats"
                    hasArrow={true}
                    size="sm"
                    variant="blue"
                />
            </div>

            {/* Main Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-10 md:gap-6 lg:grid-cols-4">
                {quickStats.map((stat, idx) => {
                    const innerContent = (
                        <>
                            {/* --- NEW: Visual indicator for clickable cards --- */}
                            {stat.href && (
                                <div className="absolute top-5 right-5 text-slate-300 transition-colors duration-200 group-hover:text-blue-500">
                                    <ArrowUpRight className="h-5 w-5" />
                                </div>
                            )}

                            <div className="mb-3 flex items-center gap-4 md:mb-4 md:block md:w-fit">
                                <div
                                    className={`rounded-xl border p-2.5 ${stat.bgIcon} shrink-0`}
                                >
                                    {stat.icon}
                                </div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase md:hidden">
                                    {stat.label}
                                </p>
                            </div>

                            <p className="mb-1 hidden text-xs font-bold tracking-wider text-slate-400 uppercase md:block">
                                {stat.label}
                            </p>
                            <h3 className="mb-1 text-2xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-600 md:mb-1.5 md:text-3xl">
                                {stat.value}
                            </h3>
                            <p className="mt-auto pr-6 text-xs font-medium text-slate-500">
                                {stat.subtext}
                            </p>
                        </>
                    );

                    // Added 'relative' to the base classes
                    const cardClasses =
                        "relative bg-white border border-blue-100/50 shadow-sm rounded-2xl p-5 md:p-6 flex flex-col hover:shadow-md hover:border-blue-300 transition-all duration-200 group h-full block";

                    // Conditionally render as a Next.js Link or a standard div
                    if (stat.href) {
                        return (
                            <Link key={idx} href={stat.href} className={cardClasses}>
                                {innerContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={idx} className={cardClasses}>
                            {innerContent}
                        </div>
                    );
                })}
            </div>

            {/* Quick Historic Fact Banner */}
            {/* Changed to pure white background to lift it off the blue section background */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-blue-100/50 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-6 md:p-5">
                <div className="flex w-full items-start gap-3 md:w-auto md:items-center md:gap-3.5">
                    <div className="mt-1 shrink-0 rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-600 md:mt-0">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 text-left">
                        <div className="mb-0.5 flex flex-wrap items-center gap-2 md:mb-1">
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-amber-800 uppercase md:text-[10px]">
                                Foundation
                            </span>
                            <span className="text-xs font-bold text-slate-700 md:text-sm">
                                Charter Date: June 16, 1950
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 md:text-xs">
                            Created under Republic Act No. 525.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-row justify-between gap-3 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-500 md:w-auto md:flex-nowrap md:justify-end md:gap-4 md:border-t-0 md:pt-0 md:text-xs">
                    <div className="flex flex-1 items-center justify-center gap-1.5 md:flex-auto md:justify-start">
                        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="truncate">0.33% Growth</span>
                    </div>
                    <div className="hidden h-4 w-px bg-slate-200 md:block"></div>
                    <div className="flex flex-1 items-center justify-center gap-1.5 border-l border-slate-100 pl-3 md:flex-auto md:justify-start md:border-0 md:pl-0">
                        <Compass className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        <span className="truncate">Cebuano Dialect</span>
                    </div>
                </div>
            </div>
        </Section>
    );
}
