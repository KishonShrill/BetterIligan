import { Metadata } from 'next';
import { safeJsonLd } from '@/lib/utils';
import CityStatsClient from './CityStatsClient';

// 1. STATIC METADATA (Server Side)
// Because this page isn't dynamic (it's always Iligan City), we don't need generateMetadata.
export const metadata: Metadata = {
    title: 'City Statistics & Demographics',
    description: 'Explore official statistics, demographics, infrastructure, and economic data for Iligan City, the City of Majestic Waterfalls.',
    openGraph: {
        title: 'Iligan City Statistics & Demographics',
        description: 'Explore official statistics, demographics, infrastructure, and economic data for Iligan City.',
        url: 'https://betteriligancity.org/iligan/city-stats',
        type: 'website',
    },
};

// 2. MAIN PAGE COMPONENT (Server Side)
export default function CityStatsPage() {

    // Generate Schema.org JSON-LD specifically for a City/Place
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "City",
        "name": "Iligan City",
        "alternateName": "City of Majestic Waterfalls",
        "description": "Official city profile, demographics, and statistics for Iligan City, Philippines.",
        "foundingDate": "1950-06-16",
        "url": "https://betteriligancity.org/iligan/city-stats",
        "containedInPlace": {
            "@type": "State",
            "name": "Northern Mindanao",
            "containedInPlace": {
                "@type": "Country",
                "name": "Philippines"
            }
        }
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />

            <CityStatsClient />
        </>
    );
}
