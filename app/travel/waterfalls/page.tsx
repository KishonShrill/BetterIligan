import { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";
import { WaterfallsArraySchema } from "@/validations/waterfallSchema";
import rawWaterfalls from "@/data/travel/waterfalls.json";
import WaterfallsClient from "./WaterfallsClient";

// Parsed on the server so the browser bundle stays free of zod + raw JSON.
const waterfalls = WaterfallsArraySchema.parse(rawWaterfalls);

export const metadata: Metadata = {
    title: "Waterfalls",
    description:
        "A directory of Iligan City's waterfalls — Maria Cristina, Tinago, Limunsudan and more — with locations, photos, and directions.",
    openGraph: {
        title: "Waterfalls | BetterIligan City",
        description:
            "Explore the waterfalls of Iligan, the City of Majestic Waterfalls: locations, photos, and directions.",
        url: "https://betteriligancity.org/travel/waterfalls",
        type: "website",
    },
};

export default function WaterfallsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Waterfalls of Iligan City",
        description:
            "Community-maintained directory of waterfalls in Iligan City, the City of Majestic Waterfalls.",
        url: "https://betteriligancity.org/travel/waterfalls",
        itemListElement: waterfalls.map((f, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "TouristAttraction",
                name: f.name,
                geo: { "@type": "GeoCoordinates", latitude: f.lat, longitude: f.lon },
            },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            <WaterfallsClient falls={waterfalls} />
        </>
    );
}
