import { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";
import { assistancePrograms } from "@/data/assistance";
import AssistanceClient from "./AssistanceClient";

export const metadata: Metadata = {
    title: "Scholarships & Assistance",
    description: "Scholarships and financial-assistance programs open to Iligan City residents — the City Mayor's Scholarship plus national programs from CHED, DOST-SEI, TESDA, and DSWD.",
};

export default function AssistancePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Scholarships & Assistance Programs for Iligan City",
        description:
            "Community-maintained directory of scholarships and financial-assistance programs available to Iligan City residents.",
        url: "https://betteriligancity.org/assistance",
        itemListElement: assistancePrograms.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "GovernmentService", name: p.name, provider: { "@type": "GovernmentOrganization", name: p.provider } },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            <AssistanceClient programs={assistancePrograms} />
        </>
    );
}
