import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allServices } from '@/data/services';
import { safeJsonLd } from '@/lib/utils';
import ServiceClient from './ServiceClient';
import { StandardService } from '@/validations/serviceSchema';

// 1. STATIC PARAMS
export async function generateStaticParams() {
    const standardServices = allServices.filter(
        (s): s is StandardService => s.type === "standard"
    );

    return standardServices.map((service) => ({
        slug: service.slug,
    }));
}

// 2. DYNAMIC METADATA (Server Side)
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;

    const service = allServices.find((s) => 'slug' in s && s.slug === slug);

    if (!service || service.type !== "standard") {
        return { title: 'Service Not Found' };
    }

    return {
        title: service.title,
        description: service.description,
        openGraph: {
            images: [
                {
                    url: `/images/opengraph-image/${slug}.webp`,
                    width: 1200,
                    height: 630,
                },
            ],
            siteName: 'BetterIligan',
            locale: 'en_PH',
            type: 'website',
        },
        twitter: {
            images: [`/images/opengraph-image/${slug}.webp`],
            card: 'summary_large_image',
        },
    };
}

export default async function ServicePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const foundService = allServices.find((s) => 'slug' in s && s.slug === slug);

    if (!foundService || foundService.type !== "standard") {
        notFound();
    }

    const service: StandardService = foundService;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        "name": service.title,
        "description": service.description,
        "provider": {
            "@type": "GovernmentOrganization",
            "name": service.department
        },
        "serviceType": service.category,
        "url": `https://betteriligancity.org/services/${service.slug}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />
            <ServiceClient service={service} />
        </>
    );
}
