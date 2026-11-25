import { Metadata } from "next";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { safeJsonLd } from "@/lib/utils";
import ContributeClient from "./ContributeClient";
import { topics } from "@/data/contribute";

export const metadata: Metadata = {
  title: "How to Contribute",
  description:
    "Learn how to contribute to BetterIliganCity.org by helping document jeepney routes, waterfalls, executive orders, and other public information about Iligan City.",
};

export default function HowToContributePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How to Contribute to BetterIliganCity",
    description:
      "A guide on contributing to BetterIliganCity.org by documenting public information about Iligan City.",
    url: "https://betteriligancity.org/about/how-to-contribute",
    about: {
      "@type": "NGO",
      name: "BetterIliganCity",
      description:
        "A volunteer-led civic tech initiative building digital public goods for Iligan City.",
      parentOrganization: {
        "@type": "NGO",
        name: "BetterGov Philippines",
        url: "https://bettergov.ph/",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <main className="min-h-screen bg-slate-50 pb-24 font-sans">
        <SubpageNav href="/about" text="About" />
        <SubpageHero>
          <SubpageHero.Badges>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
              Open Source · Civic Tech
            </span>
          </SubpageHero.Badges>
          <SubpageHero.Title>How to Contribute</SubpageHero.Title>
          <SubpageHero.Description>
            Help us document and improve public information about Iligan City.
            Choose a contribution area below and follow the step-by-step guide.
          </SubpageHero.Description>
        </SubpageHero>

        <ContributeClient topics={topics} />
      </main>
    </>
  );
}
