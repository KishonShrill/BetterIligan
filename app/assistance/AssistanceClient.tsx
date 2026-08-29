"use client";

import { useMemo, useState } from "react";
import {
  Search,
  GraduationCap,
  Coins,
  Wrench,
  ExternalLink,
  Users,
  CalendarClock,
  Building2,
  TriangleAlert,
  ClipboardList,
} from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import type { AssistanceProgram } from "@/validations/assistanceSchema";

type Category = AssistanceProgram["category"];

const CATEGORY_META: Record<
  Category,
  { label: string; color: string; Icon: typeof Coins }
> = {
  scholarship: { label: "Scholarship", color: "#2563eb", Icon: GraduationCap },
  "financial-assistance": {
    label: "Financial Assistance",
    color: "#059669",
    Icon: Coins,
  },
  training: { label: "Training", color: "#d97706", Icon: Wrench },
};

const FILTERS: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scholarship", label: "Scholarships" },
  { key: "financial-assistance", label: "Financial Assistance" },
  { key: "training", label: "Training" },
];

const REFERENCES = [
  { title: "Iligan City Government", url: "https://iligan.gov.ph/" },
  {
    title: "CHED – UniFAST (TES & Tulong Dunong)",
    url: "https://ched.gov.ph/unifast/",
  },
  {
    title: "DOST-SEI – Science Education Institute",
    url: "https://www.sei.dost.gov.ph/",
  },
  {
    title: "TESDA – Scholarship & Student Assistance Programs",
    url: "https://www.tesda.gov.ph/About/TESDA/1279",
  },
  {
    title: "DSWD – AICS (Assistance to Individuals in Crisis Situations)",
    url: "https://aics.dswd.gov.ph/educational-assistance/",
  },
];

export default function AssistanceClient({
  programs,
}: {
  programs: AssistanceProgram[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Category>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter(
      (p) =>
        (filter === "all" || p.category === filter) &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          p.forWho.toLowerCase().includes(q)),
    );
  }, [programs, query, filter]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Go Home" />
      <SubpageHero>
        <SubpageHero.Title>Scholarships &amp; Assistance</SubpageHero.Title>
        <SubpageHero.Description>
          Scholarships and financial-assistance programs open to Iligan
          residents — from the city government and national agencies.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="container mx-auto space-y-6 px-4 py-8 md:px-6">
        {/* Trust disclaimer — this is not an official channel and cycles change. */}
        <div
          role="note"
          className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <TriangleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            aria-hidden
          />
          <p>
            Community-maintained — <strong>not an official channel</strong>.
            Deadlines, amounts, and requirements change every cycle, so always
            confirm the current details on the official page or with the office
            before applying. Last checked <strong>8 July 2026</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs…"
              aria-label="Search programs"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  filter === key
                    ? "border-transparent bg-slate-800 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map((p) => {
            const { label, color, Icon } = CATEGORY_META[p.category];
            return (
              <article
                key={p.name}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}1a` }}
                    >
                      <Icon className="h-6 w-6" style={{ color }} aria-hidden />
                    </span>
                    <span
                      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
                      style={{ backgroundColor: color }}
                    >
                      {label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {p.scope === "city" ? "Iligan City" : "National"}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {p.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />{" "}
                  {p.provider}
                </p>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <Users className="h-3.5 w-3.5" aria-hidden /> Who
                      it&apos;s for
                    </dt>
                    <dd className="mt-1 leading-relaxed text-slate-600">
                      {p.forWho}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <ClipboardList className="h-3.5 w-3.5" aria-hidden /> How
                      to apply
                    </dt>
                    <dd className="mt-1 leading-relaxed text-slate-600">
                      {p.howToApply}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden />{" "}
                      Timing &amp; status
                    </dt>
                    <dd className="mt-1 leading-relaxed text-slate-600">
                      {p.timing}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <a
                    href={p.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />{" "}
                    Official page
                  </a>
                  <span className="text-[10px] text-slate-400">
                    verified {p.verifiedAt}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="py-8 text-center text-slate-400">
            No programs match your search.
          </p>
        )}

        <ReferencesFooter
          references={REFERENCES}
          disclaimer="Program details were compiled from the official pages above and last checked on 8 July 2026. This directory points you to each program and its official source; it does not process applications. Requirements, amounts, and deadlines change every cycle — always verify on the official page or with the administering office."
        />
      </div>
    </main>
  );
}
