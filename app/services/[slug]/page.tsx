import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allServices } from '@/data/services';

import ServiceClient from './ServiceClient';

// 1. DYNAMIC METADATA (Server Side)
export async function generateMetadata({
    params
}: {
    params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;

    // Find the service by slug
    const service = allServices.find((s) => s.type !== "external" && s.slug === slug);

    // TYPE GUARD: Reject it if it doesn't exist, OR if it's an internal community profile.
    if (!service || service.type === "internal") {
        return { title: 'Service Not Found' };
    }

    return {
        title: service.title,
        description: service.description,
    };
}

// 2. MAIN PAGE COMPONENT (Server Side)
export default async function ServicePage({
    params
}: {
    params: Promise<{ category: string; slug: string }>
}) {
    const { slug, category } = await params;

    const service = allServices.find((s) => s.type !== "external" && s.slug === slug);

    // TYPE GUARD: If it's a community profile acting like a service, we 404 here
    // because they should be looking at /community/[slug] instead!
    if (!service || service.type === "internal") {
        notFound();
    }

    // Generate the Schema.org JSON-LD specifically for Government Services
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        "name": service.title,
        "description": service.description,
        "provider": {
            "@type": "GovernmentOrganization",
            "name": service.type === "standard" || service.type === "external" ? service.department : "Local Government of Iligan City"
        },
        "serviceType": service.category,
        "url": service.type === "external" ? service.externalUrl : `https://betteriligancity.org/services/${category}/${service.slug}`
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Pass the fully type-safe data into your Client Component UI */}
            <ServiceClient service={service} />
        </>
    );
}
