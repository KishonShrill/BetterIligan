import { Metadata } from 'next';
import { disasterFacilities } from '@/data/disaster';
import { getEffectiveBangonConfig } from '@/data/bangon/state';
import {
    getApprovedBoardMessages,
    getVerifiedIncidents,
    getPendingBoardMessages,
    getUnverifiedIncidents,
    getFeedItems,
} from '@/data/bangon/queries';
import { isAdmin } from '@/lib/bangonAuth';
import { safeJsonLd } from '@/lib/utils';
import BangonCommandCenter from './BangonCommandCenter';

export const metadata: Metadata = {
    title: 'Community Relief Command Center',
    description: "Iligan's community relief command center — a live map with hazard reports and a community board. On standby until an emergency, then live coordination when it counts.",
};

export default async function BangonIliganPage() {
    // Effective config overlays the runtime D1 incident state (activate/deactivate
    // from /admin) onto the committed static config. Moderators moderate inline
    // (no /admin round-trip): when signed in, they also get the pending queues
    // and unmasked contacts.
    const [config, admin] = await Promise.all([getEffectiveBangonConfig(), isAdmin()]);
    const [messages, reports, pendingMessages, pendingReports, feed] = await Promise.all([
        config.boardEnabled ? getApprovedBoardMessages() : Promise.resolve([]),
        getVerifiedIncidents(50, !admin),
        admin && config.boardEnabled ? getPendingBoardMessages() : Promise.resolve([]),
        admin ? getUnverifiedIncidents() : Promise.resolve([]),
        getFeedItems(),
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
                feed={feed}
                messages={messages}
                reports={reports}
                pendingMessages={pendingMessages}
                pendingReports={pendingReports}
                isAdmin={admin}
                config={config}
            />
        </>
    );
}
