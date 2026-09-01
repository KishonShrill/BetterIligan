import { Metadata } from "next";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import BudgetInteractive from "./BudgetInteractive";

import { BudgetData } from "@/validations/budgetSchema";
import rawBudgetData from "@/data/iligan/budget.json";

// --- FORCE STATIC EXPORT TO SAVE CPU ---
export const dynamic = "force-static";

// --- BYPASS ZOD PARSING ---
const budgetData = rawBudgetData as BudgetData;

export const metadata: Metadata = {
  title: "Budget & Finances",
  description:
    "See where Iligan City's revenue comes from and where it's spent, sourced from official BLGF fiscal reports.",
};

export default function BudgetPage() {
  const latest = budgetData.years[budgetData.years.length - 1];

  const budgetReferences = [
    {
      title:
        "Bureau of Local Government Finance — Statement of Receipts and Expenditures by LGU (FY2024, FY2025 Preliminary)",
      url: "https://blgf.gov.ph/lgu-fiscal-data/",
    },
  ];
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Go Home" />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Public Finance · FY{latest.fiscalYear}{" "}
            {latest.status === "preliminary" && "(Preliminary)"}
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Budget & Finances</SubpageHero.Title>
        <SubpageHero.Description>
          Every peso Iligan City collects, and every peso it spends — filed by
          the City Treasurer with the Bureau of Local Government Finance.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-6 md:py-12">
        {/* --- ISOLATED CLIENT COMPONENT --- */}
        <BudgetInteractive data={budgetData} />

        <ReferencesFooter
          references={budgetReferences}
          disclaimer="Figures are curated from BLGF's official per-LGU Statement of Receipts and Expenditures. FY2025 figures are preliminary and subject to revision by BLGF."
        />
      </div>
    </main>
  );
}
