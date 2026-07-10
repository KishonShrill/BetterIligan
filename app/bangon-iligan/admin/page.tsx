import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Check, EyeOff, ShieldCheck, X, MessageSquare, TriangleAlert, LogOut, CheckCircle2, Trash2 } from 'lucide-react';
import { isAdmin } from '@/lib/bangonAuth';
import {
    getPendingBoardMessages,
    getApprovedBoardMessages,
    getUnverifiedIncidents,
    getActiveIncidents,
} from '@/data/bangon/queries';
import {
    approveBoardMessage,
    hideBoardMessage,
    deleteBoardMessage,
    verifyIncident,
    dismissIncident,
    resolveIncident,
    deleteIncident,
    adminLogout,
} from '@/actions/bangonAdmin';
import type { IncidentReportRow } from '@/validations/bangonSchema';

export const metadata: Metadata = {
    title: 'Bangon Iligan — Moderation',
    robots: { index: false, follow: false },
};

const INCIDENT_LABEL: Record<IncidentReportRow['incident_type'], string> = {
    natural_disaster: 'Disaster',
    fire: 'Fire',
    medical: 'Medical',
    security: 'Security',
    infrastructure: 'Hazard',
    other: 'Other',
};

export default async function AdminPage() {
    if (!(await isAdmin())) redirect('/bangon-iligan/admin/login');

    const [pending, approved, unverified, active] = await Promise.all([
        getPendingBoardMessages(),
        getApprovedBoardMessages(),
        getUnverifiedIncidents(),
        getActiveIncidents(),
    ]);

    return (
        <main className="min-h-screen bg-slate-50 pb-24 font-sans">
            <header className="border-b border-slate-200 bg-white">
                <div className="container mx-auto flex items-center gap-4 px-4 py-4 md:px-6">
                    <Link
                        href="/bangon-iligan"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" /> Command center
                    </Link>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                            <ShieldCheck className="h-3.5 w-3.5" /> Moderator
                        </span>
                        <form action={adminLogout}>
                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <LogOut className="h-4 w-4" /> Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="container mx-auto grid gap-8 px-4 py-8 md:px-6 lg:grid-cols-2">
                {/* Pending board posts */}
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-slate-900">Community board</h2>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                            {pending.length} pending
                        </span>
                    </div>

                    {pending.length === 0 ? (
                        <Empty text="No posts awaiting review." />
                    ) : (
                        <ul className="space-y-3">
                            {pending.map((m) => (
                                <li key={m.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p className="text-sm text-slate-800">{m.message}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {m.author_name || 'Anonymous'}
                                        {m.barangay ? ` · ${m.barangay}` : ''}
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <form action={approveBoardMessage.bind(null, m.id)}>
                                            <ActionButton tone="approve">
                                                <Check className="h-4 w-4" /> Approve
                                            </ActionButton>
                                        </form>
                                        <form action={hideBoardMessage.bind(null, m.id)}>
                                            <ActionButton tone="reject">
                                                <EyeOff className="h-4 w-4" /> Hide
                                            </ActionButton>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Unverified reports */}
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <TriangleAlert className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-bold text-slate-900">Hazard &amp; incident reports</h2>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                            {unverified.length} to review
                        </span>
                    </div>

                    {unverified.length === 0 ? (
                        <Empty text="No reports awaiting verification." />
                    ) : (
                        <ul className="space-y-3">
                            {unverified.map((r) => (
                                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 border border-orange-100">
                                            {INCIDENT_LABEL[r.incident_type]}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {r.barangay}
                                            {r.landmark ? ` · ${r.landmark}` : ''}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-800">{r.description}</p>
                                    <p className="mt-1 text-xs text-slate-400">Contact: {r.contact_number}</p>
                                    <div className="mt-3 flex gap-2">
                                        <form action={verifyIncident.bind(null, r.id)}>
                                            <ActionButton tone="approve">
                                                <Check className="h-4 w-4" /> Verify
                                            </ActionButton>
                                        </form>
                                        <form action={dismissIncident.bind(null, r.id)}>
                                            <ActionButton tone="reject">
                                                <X className="h-4 w-4" /> Dismiss
                                            </ActionButton>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Active (verified) reports — mark resolved when cleared */}
                <section className="lg:col-span-2">
                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-slate-900">Active reports</h2>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                            {active.length} live
                        </span>
                    </div>

                    {active.length === 0 ? (
                        <Empty text="No active reports on the public tab." />
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {active.map((r) => (
                                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 border border-orange-100">
                                            {INCIDENT_LABEL[r.incident_type]}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {r.barangay}
                                            {r.landmark ? ` · ${r.landmark}` : ''}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-800">{r.description}</p>
                                    <p className="mt-1 text-xs text-slate-400">Contact: {r.contact_number}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <form action={resolveIncident.bind(null, r.id)}>
                                            <ActionButton tone="approve">
                                                <CheckCircle2 className="h-4 w-4" /> Mark resolved
                                            </ActionButton>
                                        </form>
                                        <form action={dismissIncident.bind(null, r.id)}>
                                            <ActionButton tone="reject">
                                                <EyeOff className="h-4 w-4" /> Unverify
                                            </ActionButton>
                                        </form>
                                        <form action={deleteIncident.bind(null, r.id)}>
                                            <ActionButton tone="danger">
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </ActionButton>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Approved (live) board posts — un-publish or delete accidental ones */}
                <section className="lg:col-span-2">
                    <div className="mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-slate-600" />
                        <h2 className="text-lg font-bold text-slate-900">Live board posts</h2>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                            {approved.length} public
                        </span>
                    </div>

                    {approved.length === 0 ? (
                        <Empty text="No approved posts are live yet." />
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {approved.map((m) => (
                                <li key={m.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p className="text-sm text-slate-800">{m.message}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {m.author_name || 'Anonymous'}
                                        {m.barangay ? ` · ${m.barangay}` : ''}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <form action={hideBoardMessage.bind(null, m.id)}>
                                            <ActionButton tone="reject">
                                                <EyeOff className="h-4 w-4" /> Un-publish
                                            </ActionButton>
                                        </form>
                                        <form action={deleteBoardMessage.bind(null, m.id)}>
                                            <ActionButton tone="danger">
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </ActionButton>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

function ActionButton({ tone, children }: { tone: 'approve' | 'reject' | 'danger'; children: React.ReactNode }) {
    const cls =
        tone === 'approve'
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : tone === 'danger'
                ? 'border border-red-200 text-red-600 hover:bg-red-50'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50';
    return (
        <button
            type="submit"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${cls}`}
        >
            {children}
        </button>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            {text}
        </div>
    );
}
