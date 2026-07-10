'use client'

import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import {
    Activity, MessageSquare, Send, Loader2, MapPin, Phone, CheckCircle2,
    Check, EyeOff, Trash2, ShieldCheck,
} from 'lucide-react';
import { postBoardMessage } from '@/actions/bangon';
import {
    approveBoardMessage, hideBoardMessage, deleteBoardMessage,
    verifyIncident, resolveIncident, deleteIncident,
} from '@/actions/bangonAdmin';
import type { BoardMessageRow, IncidentReportRow } from '@/validations/bangonSchema';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const INCIDENT_LABEL: Record<IncidentReportRow['incident_type'], string> = {
    natural_disaster: 'Disaster',
    fire: 'Fire',
    medical: 'Medical',
    security: 'Security',
    infrastructure: 'Hazard',
    other: 'Other',
};

function relativeTime(iso: string): string {
    // Stored timestamps are UTC ('YYYY-MM-DD HH:MM:SS'); normalise to ISO.
    const t = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z').getTime();
    const diff = Date.now() - t;
    if (Number.isNaN(diff) || diff < 0) return 'just now';
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

type Tab = 'reports' | 'board';

export default function BangonLivePanel({
    reports,
    messages,
    pendingReports,
    pendingMessages,
    isAdmin,
    boardEnabled,
}: {
    reports: IncidentReportRow[];
    messages: BoardMessageRow[];
    pendingReports: IncidentReportRow[];
    pendingMessages: BoardMessageRow[];
    isAdmin: boolean;
    boardEnabled: boolean;
}) {
    const [tab, setTab] = useState<Tab>(boardEnabled ? 'board' : 'reports');
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        try {
            let token = '';
            if (SITE_KEY) {
                token = recaptchaRef.current?.getValue() ?? '';
                if (!token) {
                    toast.error('Please complete the CAPTCHA.');
                    return;
                }
            }
            const result = await postBoardMessage(new FormData(e.currentTarget), token);
            if (result.success) {
                toast.success('Posted! An admin will review it before it appears.');
                formRef.current?.reset();
                recaptchaRef.current?.reset();
            } else {
                toast.error(result.error);
                recaptchaRef.current?.reset();
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100 bg-slate-50/70">
                <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={Activity} badge={isAdmin ? pendingReports.length : 0}>
                    Reports
                </TabButton>
                {boardEnabled && (
                    <TabButton active={tab === 'board'} onClick={() => setTab('board')} icon={MessageSquare} badge={isAdmin ? pendingMessages.length : 0}>
                        Board
                    </TabButton>
                )}
                {isAdmin ? (
                    <span className="ml-auto mr-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        <ShieldCheck className="h-3 w-3" /> Moderator
                    </span>
                ) : (
                    <span className="ml-auto mr-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Live
                    </span>
                )}
            </div>

            {/* Body */}
            {tab === 'reports' ? (
                <ul className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {isAdmin && pendingReports.length > 0 && (
                        <>
                            <ModHeader label="Awaiting verification" count={pendingReports.length} />
                            {pendingReports.map((r) => (
                                <li key={r.id} className="bg-amber-50/50 px-4 py-3">
                                    <ReportHead r={r} pending time={relativeTime(r.created_at)} />
                                    <p className="mt-1 break-words text-sm leading-snug text-slate-700">{r.description}</p>
                                    <ContactLine value={r.contact_number} />
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <ModButton action={verifyIncident.bind(null, r.id)} tone="go"><Check className="h-3.5 w-3.5" /> Verify</ModButton>
                                        <ModButton action={deleteIncident.bind(null, r.id)} tone="danger"><Trash2 className="h-3.5 w-3.5" /> Delete</ModButton>
                                    </div>
                                </li>
                            ))}
                            {reports.length > 0 && <ModHeader label="Published" count={reports.length} />}
                        </>
                    )}
                    {reports.length === 0 && !(isAdmin && pendingReports.length > 0) && (
                        <EmptyState title="No verified reports yet" body="Verified hazard and incident reports will stream in here." />
                    )}
                    {reports.map((r) => {
                        const cleared = r.status === 'resolved';
                        return (
                            <li key={r.id} className={`px-4 py-3 ${cleared ? 'opacity-60' : ''}`}>
                                <ReportHead r={r} cleared={cleared} time={relativeTime(r.created_at)} />
                                <p className={`mt-1 break-words text-sm leading-snug ${cleared ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700'}`}>
                                    {r.description}
                                </p>
                                <ContactLine value={r.contact_number} />
                                {isAdmin && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {!cleared && (
                                            <ModButton action={resolveIncident.bind(null, r.id)} tone="go"><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</ModButton>
                                        )}
                                        <ModButton action={deleteIncident.bind(null, r.id)} tone="danger"><Trash2 className="h-3.5 w-3.5" /> Delete</ModButton>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <>
                    <ul className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {isAdmin && pendingMessages.length > 0 && (
                            <>
                                <ModHeader label="Pending review" count={pendingMessages.length} />
                                {pendingMessages.map((m) => (
                                    <li key={m.id} className="bg-amber-50/50 px-4 py-3">
                                        <MessageHead m={m} pending time={relativeTime(m.created_at)} />
                                        <p className="mt-1 break-words text-sm leading-snug text-slate-700">{m.message}</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <ModButton action={approveBoardMessage.bind(null, m.id)} tone="go"><Check className="h-3.5 w-3.5" /> Approve</ModButton>
                                            <ModButton action={deleteBoardMessage.bind(null, m.id)} tone="danger"><Trash2 className="h-3.5 w-3.5" /> Delete</ModButton>
                                        </div>
                                    </li>
                                ))}
                                {messages.length > 0 && <ModHeader label="Published" count={messages.length} />}
                            </>
                        )}
                        {messages.length === 0 && !(isAdmin && pendingMessages.length > 0) && (
                            <EmptyState title="Be the first to post" body="Share a preparedness tip or a note for your neighbors below." />
                        )}
                        {messages.map((m) => (
                            <li key={m.id} className="px-4 py-3">
                                <MessageHead m={m} time={relativeTime(m.created_at)} />
                                <p className="mt-1 break-words text-sm text-slate-700 leading-snug">{m.message}</p>
                                {isAdmin && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <ModButton action={hideBoardMessage.bind(null, m.id)} tone="warn"><EyeOff className="h-3.5 w-3.5" /> Un-publish</ModButton>
                                        <ModButton action={deleteBoardMessage.bind(null, m.id)} tone="danger"><Trash2 className="h-3.5 w-3.5" /> Delete</ModButton>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Compose */}
                    <form ref={formRef} onSubmit={onSubmit} className="border-t border-slate-100 p-3 space-y-2 bg-slate-50/50">
                        <textarea
                            name="message"
                            required
                            rows={2}
                            maxLength={280}
                            placeholder="Post a message to the community…"
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                name="authorName"
                                maxLength={80}
                                placeholder="Name (optional)"
                                className="w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            />
                            <input
                                name="barangay"
                                maxLength={100}
                                placeholder="Barangay (optional)"
                                className="w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>
                        {SITE_KEY && (
                            <div className="flex justify-center pt-1">
                                <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Post to board
                        </button>
                        <p className="text-center text-[11px] text-slate-400">
                            Posts are reviewed by a moderator before they appear.
                        </p>
                    </form>
                </>
            )}
        </div>
    );
}

function ReportHead({ r, time, pending, cleared }: { r: IncidentReportRow; time: string; pending?: boolean; cleared?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex shrink-0 items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 border border-orange-100">
                {INCIDENT_LABEL[r.incident_type]}
            </span>
            {pending && <StatusTag tone="amber">Pending</StatusTag>}
            {cleared && <StatusTag tone="emerald"><CheckCircle2 className="h-3 w-3" /> Cleared</StatusTag>}
            <span className="flex min-w-0 items-center gap-1 text-xs font-semibold text-slate-500">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{r.barangay}{r.landmark ? ` · ${r.landmark}` : ''}</span>
            </span>
            <span className="ml-auto shrink-0 text-[10px] text-slate-400">{time}</span>
        </div>
    );
}

function MessageHead({ m, time, pending }: { m: BoardMessageRow; time: string; pending?: boolean }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="max-w-[45%] shrink-0 truncate font-bold text-slate-800">{m.author_name || 'Anonymous'}</span>
            {pending && <StatusTag tone="amber">Pending</StatusTag>}
            {m.barangay && (
                <span className="flex min-w-0 items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{m.barangay}</span>
                </span>
            )}
            <span className="ml-auto shrink-0 text-[10px] text-slate-400">{time}</span>
        </div>
    );
}

function ContactLine({ value }: { value: string }) {
    return (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
            <Phone className="h-3 w-3 shrink-0" /> {value}
        </p>
    );
}

function StatusTag({ tone, children }: { tone: 'amber' | 'emerald'; children: React.ReactNode }) {
    const cls = tone === 'amber'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-100';
    return (
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
            {children}
        </span>
    );
}

function ModHeader({ label, count }: { label: string; count: number }) {
    return (
        <li className="sticky top-0 z-10 bg-slate-100/95 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 backdrop-blur">
            {label} · {count}
        </li>
    );
}

// Server-action-backed moderation button (works without JS; revalidatePath in
// the action refreshes the feed in place, so no page switching).
function ModButton({ action, tone, children }: { action: () => Promise<void>; tone: 'go' | 'warn' | 'danger'; children: React.ReactNode }) {
    const cls =
        tone === 'go'
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : tone === 'danger'
                ? 'border border-red-200 text-red-600 hover:bg-red-50'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50';
    return (
        <form action={action}>
            <button type="submit" className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${cls}`}>
                {children}
            </button>
        </form>
    );
}

function TabButton({
    active,
    onClick,
    icon: Icon,
    badge,
    children,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                active
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
            <Icon className="w-4 h-4" />
            {children}
            {badge ? (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {badge}
                </span>
            ) : null}
        </button>
    );
}

function EmptyState({ title, body }: { title: string; body: string }) {
    return (
        <li className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <p className="font-bold text-slate-600">{title}</p>
            <p className="mt-1 text-sm text-slate-400">{body}</p>
        </li>
    );
}
