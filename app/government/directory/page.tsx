import { Metadata } from 'next';
import DirectoryClient from './DirectoryClient';

// 1. STATIC METADATA (Server Side)
export const metadata: Metadata = {
    title: 'Government Directory',
    description: 'A comprehensive directory of local and national government agencies, GOCCs, and constitutional commissions operating in Iligan City.',
    openGraph: {
        title: 'Iligan City Government Directory',
        description: 'Find contact information, addresses, and maps for government offices and agencies in Iligan City.',
        url: 'https://betteriligancity.org/government/directory',
        type: 'website',
    },
};

// 2. MAIN PAGE COMPONENT (Server Side)
export default function GovernmentDirectoryPage() {

    // Generate Schema.org JSON-LD specifically for a Directory/Collection
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Iligan City Government Directory",
        "description": "Directory of local government units, national agencies, and GOCCs in Iligan City.",
        "url": "https://betteriligancity.org/government/directory",
        "about": {
            "@type": "City",
            "name": "Iligan City"
        }
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Render your interactive Client UI */}
            <DirectoryClient />
        </>
    );
}
