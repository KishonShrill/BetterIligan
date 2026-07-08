'use client'

import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { TriangleAlert, X, Loader2, Send } from 'lucide-react';
import { submitHazardReport } from '@/actions/bangon';
import type { IncidentType } from '@/validations/bangonSchema';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
    { value: 'infrastructure', label: 'Infrastructure / utility hazard' },
    { value: 'natural_disaster', label: 'Flood-prone / landslide-prone area' },
    { value: 'fire', label: 'Fire hazard' },
    { value: 'security', label: 'Safety / security concern' },
    { value: 'medical', label: 'Medical / health hazard' },
    { value: 'other', label: 'Other' },
];

export default function HazardReportModal() {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
            const result = await submitHazardReport(new FormData(e.currentTarget), token);
            if (result.success) {
                toast.success('Report submitted! An admin will review it shortly.');
                setOpen(false);
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
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100"
            >
                <TriangleAlert className="w-4 h-4" />
                Report a hazard
            </button>

            {open && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
                            <h2 className="text-lg font-bold text-slate-900">Report a hazard</h2>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4 p-6">
                            <Field label="Type of hazard">
                                <select
                                    name="incidentType"
                                    required
                                    defaultValue="infrastructure"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                >
                                    {TYPE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Barangay">
                                <input
                                    name="barangay"
                                    required
                                    placeholder="e.g. Tibanga"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </Field>

                            <Field label="Landmark" optional>
                                <input
                                    name="landmark"
                                    placeholder="Nearby landmark to help locate it"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </Field>

                            <Field label="What's the hazard?">
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="e.g. Clogged canal that floods during heavy rain; broken warning siren at the barangay hall."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </Field>

                            <Field label="Contact number">
                                <input
                                    name="contactNumber"
                                    required
                                    inputMode="tel"
                                    placeholder="09XX XXX XXXX"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </Field>

                            {SITE_KEY && (
                                <div className="flex justify-center pt-1">
                                    <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Submit report
                            </button>
                            <p className="text-center text-[11px] text-slate-400">
                                Reviewed by a moderator before it appears on the map or feed.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function Field({
    label,
    optional,
    children,
}: {
    label: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">
                {label}
                {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
            </label>
            {children}
        </div>
    );
}
