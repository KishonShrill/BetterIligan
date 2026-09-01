import Link from "next/link";
import {
  Building2,
  MapPin,
  CalendarDays,
  Users,
  Banknote,
  Landmark,
  Calendar,
  PieChart,
  Mountain,
  GraduationCap,
  Stethoscope,
  Zap,
  Anchor,
  Wifi,
  Info,
} from "lucide-react";
import Section from "@/components/ui/Section";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import CityTabs from "./CityTabs"; // <-- Imported your new client component

import { CityProfileData } from "@/validations/cityProfileSchema";
import rawCityData from "@/data/iligan/city-profile.json";

export const dynamic = "force-static";

const cityData = rawCityData as CityProfileData;

export default function CityStatsFullPage() {
  const cityStatsReferences = [
    {
      title:
        "Philippine Statistics Authority 2024 POPCEN · PSA City GDP 2022 · Iligan City Government official records",
      url: "https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president",
    },
  ];

  return (
    <main className="min-h-screen scroll-mt-0 bg-slate-50 font-sans">
      <h2 className="sr-only">
        Iligan City official profile — demographics, government, economy,
        environment, and infrastructure.
      </h2>

      {/* --- HERO SECTION --- */}
      <SubpageHero
        className="from-primary-700 to-primary-600 rounded-b-3xl bg-linear-to-r"
        logoUrl={"/images/logos/city-legal-office-(clo).png"}
      >
        <SubpageHero.Badges>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#185FA5] bg-[#0C447C] px-2.5 py-0.5 text-[11px] font-medium text-[#85B7EB]">
            <Building2 className="h-3 w-3" /> {cityData.header.classification}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#185FA5] bg-[#0C447C] px-2.5 py-0.5 text-[11px] font-medium text-[#85B7EB]">
            <MapPin className="h-3 w-3" /> {cityData.header.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#185FA5] bg-[#0C447C] px-2.5 py-0.5 text-[11px] font-medium text-[#85B7EB]">
            <CalendarDays className="h-3 w-3" /> {cityData.header.foundedBadge}
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title className="text-white">
          {cityData.header.name}
        </SubpageHero.Title>
        <SubpageHero.Description className="text-[#85B7EB]!">
          {cityData.header.description}{" "}
          <span className="font-medium text-[#B5D4F4]">
            {cityData.header.highlight}
          </span>
          {cityData.header.descriptionEnd}
        </SubpageHero.Description>

        <div className="mt-5 grid grid-cols-2 gap-0 border-t border-[#185FA5] pt-5 sm:grid-cols-3 md:grid-cols-6">
          {cityData.quickStats.map((stat, idx) => (
            <div key={idx} className="px-2 py-2.5">
              <div className="mb-0.5 text-[10px] font-medium tracking-wider text-[#378ADD] uppercase">
                {stat.label}
              </div>
              <div className="text-[14px] leading-snug font-medium text-white">
                {stat.value}
              </div>
              <div className="mt-px text-[10px] text-[#85B7EB]">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </SubpageHero>

      {/* --- SECTIONS via CityTabs --- */}
      <Section className="max-sm:pt-0 max-sm:pb-8">
        <CityTabs
          sections={{
            all: (
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Users className="h-3.5 w-3.5 text-[#378ADD]" /> Population
                  </div>
                  <div className="text-[22px] leading-tight font-bold text-slate-900">
                    368,132
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    2024 Census · 87,239 households
                  </div>
                  <hr className="my-3 border-t border-[#E6F1FB]" />
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">Density</span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      452.60 / km²
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Growth rate
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      +0.33% / year
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Barangays
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      44
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[13px] text-slate-500">Language</span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      Cebuano
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Banknote className="h-3.5 w-3.5 text-[#378ADD]" /> Economy
                  </div>
                  <div className="text-[22px] leading-tight font-bold text-slate-900">
                    ₱77.02B
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    GDP 2022 · equivalent $1.36B USD
                  </div>
                  <hr className="my-3 border-t border-[#E6F1FB]" />
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Revenue (2024)
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      ₱3,031M
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Assets (2024)
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      ₱13,377M
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#E6F1FB] py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Income class
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      1st city
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[13px] text-slate-500">
                      Poverty rate
                    </span>
                    <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                      11.8% (2021)
                    </span>
                  </div>
                </div>
                <div className="col-span-1 grid grid-cols-2 gap-2.5 md:col-span-2 md:grid-cols-4 lg:grid-cols-8">
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      23
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Waterfalls
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      8
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Natural springs
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      15
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Tourist caves
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      181
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Schools
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      54
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Health facilities
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      11
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Major industries
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      12
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Seaports
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] p-4 text-center">
                    <div className="text-[30px] leading-none font-bold text-[#042C53]">
                      24
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#185FA5]">
                      Banks
                    </div>
                  </div>
                </div>
              </div>
            ),
            demographics: (
              <>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {cityData.demographics.grid.map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5"
                    >
                      <div className="mb-0.5 text-[11px] font-medium text-[#185FA5]">
                        {stat.label}
                      </div>
                      <div className="text-[22px] leading-tight font-bold text-slate-900">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {stat.subtext}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Info className="h-3.5 w-3.5 text-[#378ADD]" /> General info
                  </div>
                  {cityData.demographics.generalInfo.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 ${idx !== cityData.demographics.generalInfo.length - 1 ? "border-b border-[#E6F1FB]" : ""}`}
                    >
                      <span className="text-[13px] text-slate-500">
                        {row.key}
                      </span>
                      <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ),
            government: (
              <>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Landmark className="h-3.5 w-3.5 text-[#378ADD]" /> Local
                    government
                  </div>
                  {cityData.government.local.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 ${idx !== cityData.government.local.length - 1 ? "border-b border-[#E6F1FB]" : ""}`}
                    >
                      <span className="text-[13px] text-slate-500">
                        {row.key}
                      </span>
                      <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Calendar className="h-3.5 w-3.5 text-[#378ADD]" /> History
                    & classification
                  </div>
                  {cityData.government.history.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 ${idx !== cityData.government.history.length - 1 ? "border-b border-[#E6F1FB]" : ""}`}
                    >
                      <span className="text-[13px] text-slate-500">
                        {row.key}
                      </span>
                      <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ),
            economy: (
              <>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {cityData.economy.grid.map((stat, idx) => (
                    <Link
                      key={idx}
                      href={stat.href ? stat.href : "#"}
                      className={`block border border-[#B5D4F4] bg-white ${stat.href ? "cursor-pointer transition-colors hover:border-[#185FA5]" : "cursor-default"} rounded-2xl p-4 md:p-5`}
                    >
                      <div className="mb-0.5 text-[11px] font-medium text-[#185FA5]">
                        {stat.label}
                      </div>
                      <div className="text-[22px] leading-tight font-bold text-slate-900">
                        {stat.value}
                      </div>
                      {stat.subtext && (
                        <div className="mt-1 text-[11px] text-slate-500">
                          {stat.subtext}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <PieChart className="h-3.5 w-3.5 text-[#378ADD]" /> Commerce
                    & services
                  </div>
                  {cityData.economy.commerce.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 ${idx !== cityData.economy.commerce.length - 1 ? "border-b border-[#E6F1FB]" : ""}`}
                    >
                      <span className="text-[13px] text-slate-500">
                        {row.key}
                      </span>
                      <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ),
            environment: (
              <>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {cityData.environment.wonders.map((wonder, idx) => (
                    <div
                      key={idx}
                      className={`${wonder.bgColor} border ${wonder.borderColor} rounded-2xl p-4 text-center`}
                    >
                      <div
                        className={`text-[30px] font-medium ${wonder.divColor} leading-none`}
                      >
                        {wonder.count}
                      </div>
                      <div className={`text-[12px] ${wonder.textColor} mt-1.5`}>
                        {wonder.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Mountain className="h-3.5 w-3.5 text-[#378ADD]" />{" "}
                    Geography & climate
                  </div>
                  {cityData.environment.geography.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-1.5 ${idx !== cityData.environment.geography.length - 1 ? "border-b border-[#E6F1FB]" : ""}`}
                    >
                      <span className="text-[13px] text-slate-500">
                        {row.key}
                      </span>
                      <span className="max-w-[55%] text-right text-[13px] font-medium text-[#0C447C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ),
            infrastructure: (
              <>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {cityData.infrastructure.facilities.map((infra, idx) => {
                    const IconComp =
                      infra.icon === "GraduationCap"
                        ? GraduationCap
                        : infra.icon === "Stethoscope"
                          ? Stethoscope
                          : infra.icon === "Zap"
                            ? Zap
                            : Anchor;

                    return (
                      <Link
                        href={infra.href ? infra.href : "#"}
                        key={idx}
                        className={`cursor-default border border-[#B5D4F4] bg-white ${infra.href && "group cursor-pointer transition-colors duration-100 hover:border-[#185FA5] hover:bg-[#185FA5]"} flex items-start gap-3 rounded-2xl p-4`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E6F1FB] text-[#185FA5]">
                          <IconComp className="h-[18px] w-[18px]" />
                        </div>
                        <div>
                          <div className="mb-0.5 text-[11px] font-medium text-[#185FA5] group-hover:text-white">
                            {infra.label}
                          </div>
                          <div className="my-0.5 text-[20px] font-bold text-slate-900 group-hover:text-white">
                            {infra.value}
                          </div>
                          <div className="text-[11px] text-slate-500 group-hover:text-white">
                            {infra.subtext}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="rounded-2xl border border-[#B5D4F4] bg-white p-4 md:p-5">
                  <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#185FA5] uppercase">
                    <Wifi className="h-3.5 w-3.5 text-[#378ADD]" />{" "}
                    Communications
                  </div>
                  <div className="flex flex-col gap-[9px]">
                    {cityData.infrastructure.communications.map((comm, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="mt-1.5 h-[5px] w-[5px] shrink-0 rounded-full bg-[#378ADD]"></div>
                        <div className="text-[13px] text-slate-900">
                          {comm
                            .split(/(\d+[^ ]*)/)
                            .map((part, i) =>
                              /^\d+/.test(part) ? (
                                <strong key={i}>{part}</strong>
                              ) : (
                                part
                              ),
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ),
          }}
        />

        <ReferencesFooter references={cityStatsReferences} />
      </Section>
    </main>
  );
}
