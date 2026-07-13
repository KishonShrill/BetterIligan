import { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import ReferencesFooter from "@/components/ui/ReferencesFooter";
import HotlinesSection from "./HotlinesSection";
import FacilitiesSection from "./FacilitiesSection";
import GuidesSection from "./GuidesSection";
import EmergencyQuickCall from "./EmergencyQuickCall";

export const metadata: Metadata = {
    title: "Iligan City Disaster Preparedness Hub",
    description: "Emergency hotlines and typhoon, flood, and earthquake preparedness guides for Iligan City.",
};

const REFERENCES = [
    { title: "NDRRMC — National Disaster Risk Reduction and Management Council", url: "https://ndrrmc.gov.ph/" },
    { title: "PAGASA — Weather advisories and rainfall warnings", url: "https://www.pagasa.dost.gov.ph/" },
    { title: "Philippine Red Cross — Safety and preparedness resources", url: "https://redcross.org.ph/" },
    { title: "Iligan City Government", url: "https://iligan.gov.ph/" },
];

export default function DisasterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Iligan City Disaster Preparedness Hub",
        description:
            "Community-maintained emergency hotlines and disaster preparedness guides for Iligan City.",
        url: "https://betteriligancity.org/disaster",
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <SubpageNav href="/" text="Go Home" />
            <SubpageHero>
                <SubpageHero.Title>Disaster Preparedness</SubpageHero.Title>
                <SubpageHero.Description>
                    Emergency numbers, a facilities map, and simple
                    what-to-do guides for Iliganons — all on one fast page.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="container mx-auto px-4 md:px-6 py-8 space-y-10">
                <EmergencyQuickCall />

                <div
                    role="note"
                    className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900"
                >
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" aria-hidden />
                    <p>
                        Community-maintained — <strong>not an official LGU channel</strong>.
                        In an emergency, always follow the Iligan City CDRRMO and your
                        barangay officials. Every number lists its source and verify date.
                    </p>
                </div>

                <FacilitiesSection />
                <HotlinesSection />
                <GuidesSection />

                <ReferencesFooter
                    references={REFERENCES}
                    disclaimer="Compiled by volunteers from publicly available sources. Verify critical information with the Iligan City CDRRMO."
                />
            </div>
        </main>
    );
}
