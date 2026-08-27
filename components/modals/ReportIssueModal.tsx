'use client'

import { useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { X, Send, AlertCircle, Loader2, Github, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
// import { submitReport } from '@/actions/report'; // <-- Update this to your actual server action

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
    const [reportType, setReportType] = useState<'info' | 'bug'>('info');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        try {
            const captchaToken = recaptchaRef.current?.getValue();
            if (!captchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
                setStatus('error');
                return;
            }

            const formData = new FormData(e.currentTarget);

            // --- REPLACE WITH YOUR ACTUAL BACKEND/SERVER ACTION ---
            // const result = await submitReport(formData, captchaToken);

            // Simulating API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = { success: true };

            if (result?.success) {
                setStatus('success');
            } else {
                toast.error("Failed to submit report.");
                recaptchaRef.current?.reset();
            }
        } catch (error) {
            console.error("Report submission failed:", error);
            toast.error("An unexpected error occurred.");
            recaptchaRef.current?.reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset state when closing so it's fresh next time it opens
    const handleClose = () => {
        setStatus('idle');
        setReportType('info');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-slate-900">Report an Issue</h2>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Sent Successfully!</h3>
                        <p className="text-slate-500">Thank you for helping keep BetterIligan accurate. Our moderators will review your report shortly.</p>
                        <button
                            onClick={handleClose}
                            className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Close Window
                        </button>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">

                        {/* Submission Type Toggle */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">What kind of issue is this?</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="info"
                                        checked={reportType === 'info'}
                                        onChange={() => setReportType('info')}
                                        className="peer sr-only"
                                    />
                                    <div className="h-full flex items-center justify-center text-sm text-slate-500 p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 font-bold transition-all hover:border-orange-300">
                                        Outdated / Incorrect Info
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="bug"
                                        checked={reportType === 'bug'}
                                        onChange={() => setReportType('bug')}
                                        className="peer sr-only"
                                    />
                                    <div className="h-full flex items-center justify-center text-sm text-slate-500 p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-slate-800 peer-checked:bg-slate-800 peer-checked:text-white font-bold transition-all hover:border-slate-400">
                                        Website Bug / Error
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* CONDITIONAL RENDERING BASED ON TYPE */}
                        {reportType === 'bug' ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
                                    <Github className="w-6 h-6 text-slate-800" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Found a technical bug?</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        If you're a programmer and you see a bug or you want to help a maintainer out, please file an issue directly on our open-source repository.
                                    </p>
                                </div>
                                <a
                                    href="https://github.com/KishonShrill/BetterIligan/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm"
                                >
                                    Open GitHub Issues <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Which info is outdated or incorrect? <span className="text-red-500">*</span></label>
                                    <input required type="text" name="targetInfo" placeholder="e.g. Health Office Contact Number, Business Permit Requirements" className="placeholder:text-slate-400 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Explain the correction <span className="text-red-500">*</span></label>
                                    <textarea required name="description" rows={4} placeholder="Why is it outdated? What is the correct information?" className="placeholder:text-slate-400 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Reference Link <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="url" name="referenceUrl" placeholder="Link to official Facebook post or updated source" className="placeholder:text-slate-400 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Your Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="email" name="email" placeholder="In case we need to clarify details" className="placeholder:text-slate-400 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                                </div>

                                {/* Google reCAPTCHA */}
                                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                                    <div className="flex justify-center pt-2">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                        />
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        Please complete the CAPTCHA or try again.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Correction"}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
