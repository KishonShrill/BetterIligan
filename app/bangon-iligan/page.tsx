import { Metadata } from 'next';
import { disasterFacilities } from '@/data/disaster';
import { bangonConfig } from '@/data/bangon';
import { getApprovedBoardMessages, getVerifiedIncidents } from '@/data/bangon/queries';
import { safeJsonLd } from '@/lib/utils';
import BangonCommandCenter from './BangonCommandCenter';

export const metadata: Metadata = {
    title: 'Bangon Iligan',
    description:
        "Iligan's community relief command center — a live map with hazard reports and a community board. On standby until an emergency, then live coordination when it counts.",
    openGraph: {
        title: 'Bangon Iligan — Community Relief Command Center',
        description:
            'A live command map with hazard reports and a community board for Iligan City. Standby until an emergency, then live relief coordination.',
        url: 'https://betteriligancity.org/bangon-iligan',
        type: 'website',
    },
};

export default async function BangonIliganPage() {
    const config = bangonConfig;
    const [messages, reports] = await Promise.all([
        config.boardEnabled ? getApprovedBoardMessages() : Promise.resolve([]),
        getVerifiedIncidents(),
    ]);

    // The 44 barangay admin pins sit at the city edges and blow out the map's
    // fit-bounds; this is an emergency-facility map, so drop them.
    const mapFacilities = disasterFacilities.filter((f) => f.category !== 'barangay');

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Bangon Iligan — Community Relief Command Center',
        description:
            "Iligan City's community relief command center: a live map with hazard reports and a community board.",
        url: 'https://betteriligancity.org/bangon-iligan',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            <BangonCommandCenter
                facilities={mapFacilities}
                messages={messages}
                reports={reports}
                config={config}
            />
        </>
    );
}
