'use client'

import Link from 'next/link';
import { FileText, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { GovernmentService } from '@/validations/serviceSchema';

interface ServiceCardProps {
    service: GovernmentService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const isExternal = service.source === 'external';

    // The inner content layout remains identical to maintain UI consistency
    const CardContent = (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full flex flex-col cursor-pointer group text-left">

            {/* Top Row: Icon & Dynamic Status Pills */}
            <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                    {service.source === 'official' && (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            Official
                        </span>
                    )}
                    {/* {service.source === 'community' && (
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            Community
                        </span>
                    )} */}
                    {service.source === 'external' && (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            External
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
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {service.department}
                </p>
            </div>

            {/* Bottom Row: Redirection Indicator & CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                        {isExternal ? 'LGU Portal Link' : `${service.source === 'official' ? 'Official' : 'Community'} Data`}
                    </span>
                </div>

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

    // Dynamic standard structural routing wrapping
    if (isExternal) {
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

    return (
        <Link href={`/services/${service.slug}`} className="block h-full group">
            {CardContent}
        </Link>
    );
}
