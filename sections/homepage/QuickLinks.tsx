import Link from "next/link";
import { Zap, Bus, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

const QUICK_LINKS = [
  {
    title: "Mugna Festival",
    description: "Event schedules & guides",
    href: "/travel/mugna",
    Icon: Sparkles,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    badge: "Current Event",
  },
  {
    title: "Electricity Rate",
    description: "Power schedules & advisories",
    href: "/iligan/electricity",
    Icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Jeepney Routes",
    description: "City-wide routes & fares",
    href: "/travel/transportation/jeepney",
    Icon: Bus,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Emergency Response",
    description: "Disaster recovery & alerts",
    href: "/bangon-iligan",
    Icon: ShieldAlert,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
];

export default function QuickLinks() {
  return (
    <Section className="bg-slate-50">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
            Quick Access
          </h2>
          <Text className="text-slate-500" size="md">
            Direct links to Iligan's most frequently used tools and current
            events.
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
        {QUICK_LINKS.map(
          ({ title, description, href, Icon, iconColor, iconBg, badge }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex w-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md max-sm:h-fit max-sm:items-center max-sm:p-4 max-sm:text-center"
            >
              {badge && (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-700 uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  </span>
                  {badge}
                </span>
              )}

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl sm:mb-4 ${iconBg}`}
              >
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>

              <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700 max-sm:text-base">
                {title}
              </h3>
              <p className="mb-4 flex-1 text-sm text-slate-500 max-sm:hidden">
                {description}
              </p>

              <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                Access Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ),
        )}
      </div>
    </Section>
  );
}
