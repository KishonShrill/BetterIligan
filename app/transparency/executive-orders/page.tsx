import { Metadata } from "next";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ExecutiveOrdersInteractive from "./ExecutiveOrdersInteractive";

import { ExecutiveOrdersData } from "@/validations/executiveOrderSchema";
import rawExecutiveOrdersData from "@/data/iligan/executive-orders.json";

const executiveOrdersData = rawExecutiveOrdersData as ExecutiveOrdersData;

export const metadata: Metadata = {
  title: "City Executive Orders",
  description:
    "Browse executive orders issued by the Office of the City Mayor of Iligan City, with links to the official documents.",
};

export default function ExecutiveOrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/transparency" text="Back to Transparency" />

      <SubpageHero>
        <SubpageHero.Title>City Executive Orders</SubpageHero.Title>
        <SubpageHero.Description>
          Directives and administrative issuances issued by the Office of the
          City Mayor of Iligan City, sourced from official city records and
          official FB page, with links to the archived documents. Covers{" "}
          {executiveOrdersData.years.join(", ")} so far, and grows as more are
          verified.
        </SubpageHero.Description>
      </SubpageHero>

      <ExecutiveOrdersInteractive data={executiveOrdersData} />
    </main>
  );
}
