import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';
import { getEffectiveBangonConfig } from '@/data/bangon/state';

// Emergency entry point pinned to the top of the homepage — but ONLY while an
// incident is active. Activation is a runtime D1 flag a moderator toggles from
// /admin (see getEffectiveBangonConfig); on standby it renders nothing, so the
// homepage is unchanged day-to-day.
//
// Server component: resolves the effective (D1-overlaid) config, no props.
export default async function ActiveIncidentBanner() {
    const config = await getEffectiveBangonConfig();
    if (!config.active) return null;
    const { activeIncident } = config;

    return (
        <aside role="alert" className="bg-red-600 text-white">
            <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <Siren className="h-5 w-5 animate-pulse" />
                    </span>
                    <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-x-2 text-[11px] font-bold uppercase tracking-widest text-red-100">
                            Active emergency
                            {activeIncident.declaredAt && (
                                <span className="font-semibold normal-case tracking-normal text-red-200">
                                    · since {activeIncident.declaredAt}
                                </span>
                            )}
                        </p>
                        <p className="mt-0.5 text-base font-extrabold leading-tight sm:text-lg">
                            {activeIncident.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-red-50/90">{activeIncident.summary}</p>
                    </div>
                </div>
                <Link
                    href="/bangon-iligan"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-50"
                >
                    Open relief command center <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </aside>
    );
}
