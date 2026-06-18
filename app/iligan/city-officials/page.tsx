import { Metadata } from "next";
import CityOfficialsClient from "./CityOfficialsClient";

export const metadata: Metadata = {
    title: "City Officials",
    description: "Meet the elected leaders of Iligan City, including the Mayor, Vice Mayor, and the members of the Sangguniang Panlungsod (City Council).",
    openGraph: {
        title: "City Officials | BetterIligan City",
        description: "Meet the elected leaders of Iligan City, including the Mayor, Vice Mayor, and the members of the Sangguniang Panlungsod (City Council).",
        url: "https://betteriligancity.org/iligan/city-officials",
    }
};

export default function CityOfficialsPage() {
    // We use a combination of CollectionPage and GovernmentOrganization schema
    // to give Google the most accurate context about what this page represents.
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Iligan City Officials Directory",
        "description": "The elected leaders of Iligan City comprising the Executive and Legislative branches.",
        "url": "https://betteriligancity.org/iligan/city-officials",
        "about": {
            "@type": "GovernmentOrganization",
            "name": "City Government of Iligan",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Iligan City",
                "addressRegion": "Northern Mindanao",
                "addressCountry": "PH"
            }
        }
    };

    return (
        <>
            {/* JSON-LD Structured Data Injection for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* The Client Component containing the layout grid */}
            <CityOfficialsClient />
        </>
    );
}
