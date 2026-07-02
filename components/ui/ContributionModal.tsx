'use client'

import { useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { submitContribution } from '@/actions/contribute';
import { headerDropdown } from '@/data/categories';

interface ContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContributionModal({ isOpen, onClose }: ContributionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        const captchaToken = recaptchaRef.current?.getValue();
        if (!captchaToken) {
            setStatus('error');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const result = await submitContribution(formData, captchaToken);

        if (result.success) {
            setStatus('success');
            // Auto-close after a few seconds
            setTimeout(() => {
                onClose();
                setStatus('idle');
            }, 3000);
        } else {
            setStatus('error');
            recaptchaRef.current?.reset(); // Reset captcha on error
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-slate-900">Contribute to BetterIligan</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Sent Successfully!</h3>
                        <p className="text-slate-500">Thank you for helping improve our city's directory. Our moderators will review this shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">

                        {/* Submission Type */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">What would you like to do?</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="cursor-pointer">
                                    <input type="radio" name="type" value="suggest" className="peer sr-only" defaultChecked />
                                    <div className="text-slate-500 p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-medium transition-all hover:border-blue-300">
                                        Suggest New Service
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="type" value="report" className="peer sr-only" />
                                    <div className="text-slate-500 p-3 text-center border-2 border-slate-200 rounded-xl peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 font-medium transition-all hover:border-orange-300">
                                        Report an Update/Fix
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Service Name / Office</label>
                            <input required type="text" name="title" placeholder="e.g. City Health Office" className="placeholder:text-slate-500 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Category</label>
                            <select required name="category" className="text-slate-500 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-white">
                                <option value="">Select a category...</option>
                                {headerDropdown.map((subItem) => (<option key={subItem.name} value={subItem.name}>{subItem.name}</option>))}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Details, Procedures, or Links</label>
                            <textarea required name="details" rows={4} placeholder="Paste requirements, Facebook links, or describe the procedures here..." className="placeholder:text-slate-500 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Your Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                            <input type="email" name="email" placeholder="In case we need to clarify details" className="placeholder:text-slate-500 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all" />
                        </div>

                        {/* Google reCAPTCHA */}
                        <div className="flex justify-center pt-2">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            />
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                Please complete the CAPTCHA or try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit to Moderators"}
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
}
