import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

// 1. STATIC METADATA (Server Side)
export const metadata: Metadata = {
    title: 'Services Directory',
    description: 'Explore official municipal services, Citizens Charter procedures, and community contributions for Iligan City.',
    openGraph: {
        title: 'Iligan City Services Directory',
        description: 'Explore official municipal services, Citizens Charter procedures, and community contributions.',
        url: 'https://betteriligancity.org/services',
        type: 'website',
    },
};

// 2. MAIN PAGE COMPONENT (Server Side)
export default function ServicesDirectoryPage() {

    // Generate Schema.org JSON-LD specifically for a Directory/Collection
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Iligan City Services Directory",
        "description": "A comprehensive directory of local government services, application procedures, and community resources in Iligan City.",
        "url": "https://betteriligancity.org/services"
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ServicesClient />
        </>
    );
}
