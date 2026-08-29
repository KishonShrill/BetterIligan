"use client";

import { Landmark, Gavel, User, Award, ShieldCheck } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";

// Adjust the path to match where you saved your JSON
import officialsData from "@/data/iligan/city-officials.json";

export default function CityOfficialsClient() {
  const cityOfficialsReferences = [
    {
      title: "iligan.gov.ph - 18th Council",
      url: "https://iligan.gov.ph/knowiligan/18thcouncil?640614431",
    },
  ];
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase">
            Local Government
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>City Officials</SubpageHero.Title>
        <SubpageHero.Description>
          The elected leaders of Iligan City comprising the Executive and
          Legislative branches.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        {/* --- EXECUTIVE BRANCH --- */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Executive Branch
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Office of the City Mayor
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {officialsData.executive.map((official, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-blue-50 transition-transform group-hover:scale-110"></div>

                <div className="relative z-10 flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-extrabold tracking-widest text-blue-600 uppercase">
                      {official.position}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {official.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- LEGISLATIVE BRANCH --- */}
        <section>
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="shrink-0 rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Gavel className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Legislative Branch
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Sangguniang Panlungsod (City Council)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {officialsData.legislative.map((official, idx) => {
              // Check if it's the SK President to give them a slightly different icon/styling
              const isSK = official.position.includes("SK");

              return (
                <div
                  key={idx}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isSK
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                    } transition-colors`}
                  >
                    {isSK ? (
                      <Award className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm leading-tight font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                      {official.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      {official.position}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ReferencesFooter references={cityOfficialsReferences} />
      </div>
    </main>
  );
}
