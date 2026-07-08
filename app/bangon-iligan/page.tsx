import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, Siren, ArrowRight, HeartHandshake, Phone } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import DisasterMapView from '@/app/disaster/map/DisasterMapView';
import { disasterFacilities } from '@/data/disaster';
import { bangonConfig } from '@/data/bangon';
import { getApprovedBoardMessages, getVerifiedIncidents } from '@/data/bangon/queries';
import { safeJsonLd } from '@/lib/utils';
import BangonLivePanel from './BangonLivePanel';
import HazardReportModal from './HazardReportModal';
import DonationSection from './DonationSection';

export const metadata: Metadata = {
    title: 'Bangon Iligan',
    description:
        "Iligan's community relief command center — evacuation map, hazard reports, and a community board. On standby until an emergency, then live coordination when it counts.",
    openGraph: {
        title: 'Bangon Iligan — Community Relief Command Center',
        description:
            "Evacuation map, hazard reports, and a community board for Iligan City. Standby until an emergency, then live relief coordination.",
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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Bangon Iligan — Community Relief Command Center',
        description:
            "Iligan City's community relief command center: evacuation map, hazard reports, and a community board.",
        url: 'https://betteriligancity.org/bangon-iligan',
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

            <SubpageNav href="/" text="Go Home" />

            {/* Status banner: standby vs active */}
            {config.active ? (
                <header className="bg-red-950 text-white">
                    <div className="container mx-auto flex items-start gap-4 px-4 py-8 md:px-6">
                        <Siren className="mt-1 h-8 w-8 shrink-0 text-red-300" aria-hidden />
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
                                Active relief operation
                            </span>
                            <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
                                {config.activeIncident.title}
                            </h1>
                            <p className="mt-2 max-w-3xl text-red-100">{config.activeIncident.summary}</p>
                        </div>
                    </div>
                </header>
            ) : (
                <header className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50 to-white">
                    <div className="container mx-auto flex items-start gap-4 px-4 py-10 md:px-6 md:py-14">
                        <ShieldCheck className="mt-1 h-8 w-8 shrink-0 text-emerald-600" aria-hidden />
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {config.standby.headline}
                            </span>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                                Bangon Iligan
                            </h1>
                            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{config.standby.message}</p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <Link
                                    href={config.standby.preparednessHref}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    Get prepared
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                {config.hazardReportsEnabled && <HazardReportModal />}
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <div className="container mx-auto space-y-10 px-4 py-8 md:px-6">
                {/* Command map (reuses the /disaster facilities map) */}
                <section aria-labelledby="map-heading">
                    <h2 id="map-heading" className="mb-1 text-2xl font-bold text-slate-900">
                        Command map
                    </h2>
                    <p className="mb-4 text-slate-600">
                        Evacuation centers, hospitals, and emergency facilities across Iligan City. Find what&apos;s
                        nearest to you.
                    </p>
                    <DisasterMapView facilities={disasterFacilities} />
                </section>

                {/* Live panel: Reports + Board */}
                <section aria-labelledby="live-heading" className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <h2 id="live-heading" className="mb-1 text-2xl font-bold text-slate-900">
                            Live feed
                        </h2>
                        <p className="mb-4 text-slate-600">
                            Verified reports and a community board — updated as people post.
                        </p>
                        <BangonLivePanel reports={reports} messages={messages} boardEnabled={config.boardEnabled} />
                    </div>

                    {/* Side rail */}
                    <aside className="space-y-4 lg:col-span-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-900">
                                <Siren className="h-5 w-5 text-red-600" />
                                <h3 className="font-bold">In an emergency</h3>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                                For life-threatening situations, call the official hotlines first — always follow the
                                Iligan City CDRRMO and your barangay officials.
                            </p>
                            <Link
                                href="/disaster"
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
                            >
                                <Phone className="h-4 w-4" />
                                Emergency hotlines
                            </Link>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-900">
                                <HeartHandshake className="h-5 w-5 text-emerald-600" />
                                <h3 className="font-bold">Want to help?</h3>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                                {config.active
                                    ? 'Relief drives and donation channels are listed below.'
                                    : "There's no active relief drive right now. The best help is to get your own household ready — and post preparedness tips on the board."}
                            </p>
                        </div>
                    </aside>
                </section>

                {/* Donations — only during an active operation */}
                {config.active && <DonationSection donation={config.donation} />}

                <div
                    role="note"
                    className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                >
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                    <p>
                        Community-run — <strong>not an official LGU channel</strong>. Reports and board posts are
                        moderated but user-submitted; verify critical information with the Iligan City CDRRMO.
                    </p>
                </div>
            </div>
        </main>
    );
}
