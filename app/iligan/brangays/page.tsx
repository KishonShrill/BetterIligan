import { Metadata } from "next";
import BarangaysClient from "./BarangaysClient";

export const metadata: Metadata = {
    title: "Barangays",
    description: "Explore the official directory of Iligan City's 44 barangays, including contact information for local offices and Punong Barangays.",
    openGraph: {
        title: "Barangay Directory | BetterIligan City",
        description: "Explore the official directory of Iligan City's 44 barangays, including contact information for local offices and Punong Barangays.",
        url: "https://betteriligancity.org/iligan/barangays", // Update this if your route is different
    }
};

export default function BarangaysPage() {
    // Injecting a CollectionPage schema tells Google this page is a directory/list
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Iligan City Barangay Directory",
        "description": "Official directory of Iligan City's 44 barangays, including contact information and Punong Barangays.",
        "url": "https://betteriligancity.org/iligan/barangays",
        "isPartOf": {
            "@type": "WebSite",
            "name": "BetterIligan City",
            "url": "https://betteriligancity.org/"
        }
    };

    return (
        <>
            {/* JSON-LD Structured Data Injection for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* The interactive Client Component we built earlier */}
            <BarangaysClient />
        </>
    );
}
