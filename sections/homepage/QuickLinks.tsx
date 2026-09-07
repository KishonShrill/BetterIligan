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
    title: "Emergency",
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
      <div className="flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-end">
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

      <div className="grid grid-cols-2 gap-2 py-4 sm:gap-4 md:grid-cols-4">
        {QUICK_LINKS.map(
          ({ title, description, href, Icon, iconColor, iconBg, badge }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex w-full flex-row justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md max-sm:h-fit max-sm:items-center max-sm:gap-2 max-sm:px-0 max-sm:py-4 max-sm:text-center sm:flex-col"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl max-sm:hidden sm:mb-4 ${iconBg}`}
              >
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>

              <Icon className={`h-6 w-6 sm:hidden ${iconColor}`} />

              <h3 className="mb-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-lg">
                {title}
              </h3>
              <p className="flex-1 text-sm text-slate-500 max-sm:hidden md:mb-4">
                {description}
              </p>

              <div className="mt-auto flex items-center gap-1.5 self-end text-sm font-semibold text-blue-600 max-md:hidden">
                View More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ),
        )}
      </div>
    </Section>
  );
}
