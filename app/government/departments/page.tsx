import { Metadata } from 'next';
import { safeJsonLd } from '@/lib/utils';
import DepartmentClient from './DepartmentClient';

// 1. STATIC METADATA (Server Side)
export const metadata: Metadata = {
    title: 'City Departments Directory',
    description: 'Explore the official directory of Iligan City local government departments, offices, and administrative units. Find contact details, department heads, and locations.',
    openGraph: {
        title: 'Iligan City Departments Directory',
        description: 'Official contact directory for all local government departments and offices within Iligan City Hall.',
        url: 'https://betteriligancity.org/government/departments',
        type: 'website',
    },
};

// 2. MAIN PAGE COMPONENT (Server Side)
export default function CityDepartmentsPage() {

    // Generate Schema.org JSON-LD specifically for a Directory/Collection
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Iligan City Departments Directory",
        "description": "Directory of local government departments, administrative offices, and public services under the Iligan City Local Government Unit (LGU).",
        "url": "https://betteriligancity.org/government/departments",
        "about": {
            "@type": "GovernmentOrganization",
            "name": "Iligan City Local Government Unit",
            "alternateName": "Iligan City Hall",
            "location": {
                "@type": "City",
                "name": "Iligan City"
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

            {/* Render your interactive Client UI */}
            <DepartmentClient />
        </>
    );
}
