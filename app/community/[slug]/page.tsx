import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allServices } from '@/data/services';
import { safeJsonLd } from '@/lib/utils';

// Import the Client UI component we just made
import CommunityClient from './CommunityClient';

export async function generateStaticParams() {
    const communityProfiles = allServices.filter(
        (c) => c.type === "internal"
    );

    return communityProfiles.map((community) => ({
        slug: community.slug,
    }));
}

// 1. DYNAMIC METADATA (Server Side)
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const community = allServices.find((c) => c.type === "internal" && c.slug === slug);

    if (!community) {
        return { title: 'Community Not Found' };
    }

    return {
        title: community.title,
        description: community.description,
    };
}


// 2. MAIN PAGE COMPONENT (Server Side)
export default async function CommunityProfilePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const community = allServices.find((c) => c.type === "internal" && c.slug === slug);

    if (!community || community.type !== "internal") {
        notFound();
    }

    const schemaUrl = community.websiteUrl
        ? community.websiteUrl
        : `https://betteriligancity.org/community/${community.slug}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": community.title,
        "description": community.description,
        "url": schemaUrl,
    };

    return (
        <>
            {/* Inject the invisible SEO script into the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />

            <CommunityClient community={community} />
        </>
    );
}
