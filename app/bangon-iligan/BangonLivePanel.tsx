'use client'

import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { Activity, MessageSquare, Send, Loader2, MapPin } from 'lucide-react';
import { postBoardMessage } from '@/actions/bangon';
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
    boardEnabled,
}: {
    reports: IncidentReportRow[];
    messages: BoardMessageRow[];
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
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[32rem]">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100 bg-slate-50/70">
                <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={Activity}>
                    Reports
                </TabButton>
                {boardEnabled && (
                    <TabButton active={tab === 'board'} onClick={() => setTab('board')} icon={MessageSquare}>
                        Board
                    </TabButton>
                )}
                <span className="ml-auto mr-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live
                </span>
            </div>

            {/* Body */}
            {tab === 'reports' ? (
                <ul className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {reports.length === 0 && (
                        <EmptyState
                            title="No verified reports yet"
                            body="Verified hazard and incident reports will stream in here."
                        />
                    )}
                    {reports.map((r) => (
                        <li key={r.id} className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 border border-orange-100">
                                    {INCIDENT_LABEL[r.incident_type]}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                    <MapPin className="w-3 h-3" /> {r.barangay}
                                    {r.landmark ? ` · ${r.landmark}` : ''}
                                </span>
                                <span className="ml-auto text-[10px] text-slate-400">{relativeTime(r.created_at)}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-700 leading-snug">{r.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <ul className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {messages.length === 0 && (
                            <EmptyState
                                title="Be the first to post"
                                body="Share a preparedness tip or a note for your neighbors below."
                            />
                        )}
                        {messages.map((m) => (
                            <li key={m.id} className="px-4 py-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="font-bold text-slate-800">{m.author_name || 'Anonymous'}</span>
                                    {m.barangay && (
                                        <span className="inline-flex items-center gap-1 text-slate-400">
                                            <MapPin className="w-3 h-3" /> {m.barangay}
                                        </span>
                                    )}
                                    <span className="ml-auto text-[10px] text-slate-400">{relativeTime(m.created_at)}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-700 leading-snug">{m.message}</p>
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
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                name="authorName"
                                maxLength={80}
                                placeholder="Name (optional)"
                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            />
                            <input
                                name="barangay"
                                maxLength={100}
                                placeholder="Barangay (optional)"
                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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

function TabButton({
    active,
    onClick,
    icon: Icon,
    children,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                active
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
            <Icon className="w-4 h-4" />
            {children}
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
