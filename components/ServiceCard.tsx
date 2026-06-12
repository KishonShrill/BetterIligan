'use client'

import Link from 'next/link';
import { FileText, CheckCircle, ArrowRight, ExternalLink, Users, AlertTriangle } from 'lucide-react';
import { GovernmentService } from '@/validations/serviceSchema';

interface ServiceCardProps {
    service: GovernmentService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const isExternal = service.type === 'external';

    const CardContent = (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full flex flex-col cursor-pointer group text-left">

            {/* Top Row: Icon & Dynamic Status Pills */}
            <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <FileText className="w-5 h-5" />
                </div>

                {/* Wrap the pills so they don't break the layout if there are many */}
                <div className="flex flex-wrap justify-end gap-2 pl-2">

                    {/* --- TRUST LEVEL BADGES (Source) --- */}
                    {service.source === 'official' && (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            Official
                        </span>
                    )}
                    {service.source === 'community' && (
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            Community
                        </span>
                    )}
                    {service.source === 'unverified' && (
                        <span className="flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                            Unverified
                        </span>
                    )}

                    {/* --- AVAILABILITY BADGES --- */}
                    {/* Note: A service can have BOTH Walk-In and Online badges! */}
                    {service.isOnline && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            Online
                        </span>
                    )}
                    {service.isWalkIn && (
                        <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            Walk-In
                        </span>
                    )}
                </div>
            </div>

            {/* Middle Row: Information Block */}
            <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    {service.category}
                </p>
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {service.department}
                </p>
            </div>

            {/* Bottom Row: Redirection Indicator & CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

                {/* Dynamic Status Indicator */}
                {service.source === 'official' && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                            {isExternal ? 'Official Portal' : 'Official Data'}
                        </span>
                    </div>
                )}

                {service.source === 'community' && (
                    <div className="flex items-center gap-1.5 text-purple-600">
                        {/* Using a generic Users icon or FileText to represent community effort */}
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                            {isExternal ? 'Community Link' : 'Community Data'}
                        </span>
                    </div>
                )}

                {service.source === 'unverified' && (
                    <div className="flex items-center gap-1.5 text-amber-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                            {isExternal ? 'Unverified Link' : 'Unverified Data'}
                        </span>
                    </div>
                )}

                {/* Call to Action Right Side */}
                <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isExternal ? (
                        <>Launch <ExternalLink className="w-4 h-4" /></>
                    ) : (
                        <>View <ArrowRight className="w-4 h-4" /></>
                    )}
                </span>
            </div>

        </div>
    );

    // TypeScript now explicitly knows that `service.externalUrl` exists inside this block!
    if (service.type === 'external') {
        return (
            <a
                href={service.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full group"
            >
                {CardContent}
            </a>
        );
    }

    // If it's not external, TypeScript knows it's a "StandardService" so it must have a slug.
    return (
        <Link href={`/services/${service.slug}`} className="block h-full group">
            {CardContent}
        </Link>
    );
}
