import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allServices } from '@/data/services';
import { safeJsonLd } from '@/lib/utils';

import ServiceClient from './ServiceClient';

export async function generateStaticParams() {
    // We only need to generate static pages for services that actually have internal pages
    const standardServices = allServices.filter(
        (s) => s.type === "standard" || s.type === "internal"
    );

    return standardServices.map((service) => ({
        slug: service.slug,
    }));
}

// 1. DYNAMIC METADATA (Server Side)
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const service = allServices.find((s) => s.type !== "external" && s.slug === slug);

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
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const service = allServices.find((s) => s.type !== "external" && s.slug === slug);

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
        "url": service.type === "external" ? service.externalUrl : `https://betteriligancity.org/services/${service.slug}`
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />

            {/* Pass the fully type-safe data into your Client Component UI */}
            <ServiceClient service={service} />
        </>
    );
}
