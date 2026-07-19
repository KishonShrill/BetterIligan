'use client'

import { useState, useEffect } from 'react';
import { Users, ArrowRight, HeartHandshake, X, ExternalLink } from 'lucide-react';

// --- CUSTOM BRAND SVGS ---
const DiscordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export default function VolunteerModalClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    return (
        <>
            {/* MODAL TRIGGER BUTTON */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center justify-center gap-2 w-full p-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-900/20"
            >
                <Users className="w-5 h-5" />
                Join the BetterIligan Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
            </button>

            {/* --- JOIN MODAL --- */}
            {isModalOpen && (
                <div className="h-[calc(100dvh-105.1px)] sm:h-[calc(100dvh-81.1px)] top-[105.1px] sm:top-[81.1px] fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                <HeartHandshake className="w-6 h-6 text-emerald-600" />
                                Connect With Us
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Links */}
                        <div className="p-6 space-y-4">
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                We coordinate online! Jump into our Discord server to talk to the team, check out our code on GitHub, or follow our official pages for updates.
                            </p>

                            {/* 1. Discord */}
                            <a
                                href="https://discord.gg/bettergovph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#5865F2] hover:bg-[#5865F2]/5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#5865F2] text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <DiscordIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-[#5865F2] transition-colors">Discord Server</div>
                                        <div className="text-xs text-slate-500">Chat with the devs & volunteers</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#5865F2]" />
                            </a>

                            {/* 2. GitHub */}
                            <a
                                href="https://github.com/KishonShrill/BetterIligan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <GitHubIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-slate-900 transition-colors">GitHub Repository</div>
                                        <div className="text-xs text-slate-500">Contribute to the source code</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-slate-900" />
                            </a>

                            {/* 3. BetterIligan FB */}
                            <a
                                href="https://www.facebook.com/BetterIliganCity.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <FacebookIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-[#1877F2] transition-colors">BetterIligan FB Page</div>
                                        <div className="text-xs text-slate-500">Local city updates & announcements</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#1877F2]" />
                            </a>

                            {/* 4. BetterGov FB */}
                            <a
                                href="https://www.facebook.com/bettergovph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#0284C7] hover:bg-[#0284C7]/5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-[#1877F2] text-[#1877F2] flex items-center justify-center shrink-0 shadow-sm">
                                        <FacebookIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">BetterGov.ph FB Page</div>
                                        <div className="text-xs text-slate-500">National parent organization</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#0284C7]" />
                            </a>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
