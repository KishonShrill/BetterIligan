import { Metadata } from "next";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ResolutionsInteractive from "./ResolutionsInteractive";

import { ResolutionsData } from "@/validations/resolutionSchema";
import rawResolutionsData from "@/data/iligan/resolutions.json";

const resolutionsData = rawResolutionsData as ResolutionsData;

export const metadata: Metadata = {
  title: "City Resolutions & Ordinances",
  description:
    "Browse resolutions and ordinances passed by the Sangguniang Panlungsod of Iligan City, with links to the official documents.",
};

export default function ResolutionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/transparency" text="Back to Transparency" />

      <SubpageHero>
        <SubpageHero.Title>City Resolutions & Ordinances</SubpageHero.Title>
        <SubpageHero.Description>
          What the Sangguniang Panlungsod has actually passed — sourced directly
          from official city records, linking to the real document for every
          entry. Covers {resolutionsData.years.join(", ")} so far, and grows as
          more are verified.
        </SubpageHero.Description>
      </SubpageHero>

      {/* --- 3. PASS DATA TO CLIENT COMPONENT --- */}
      <ResolutionsInteractive data={resolutionsData} />
    </main>
  );
}
