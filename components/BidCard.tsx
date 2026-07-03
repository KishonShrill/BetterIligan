'use client'

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import { Bid, getBidStatus, sortStages } from '@/validations/bidSchema';

const STATUS_STYLES: Record<ReturnType<typeof getBidStatus>, { bg: string; text: string }> = {
    'Open for Bidding': { bg: 'bg-blue-50', text: 'text-blue-700' },
    'Awarded': { bg: 'bg-amber-50', text: 'text-amber-700' },
    'Ongoing': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export default function BidCard({ bid }: { bid: Bid }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = getBidStatus(bid.stages);
    const style = STATUS_STYLES[status];
    const stages = sortStages(bid.stages);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
            <button
                onClick={() => setIsExpanded((v) => !v)}
                aria-expanded={isExpanded}
                className="w-full text-left p-4 md:p-6 flex items-start justify-between gap-4"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                            {bid.reference}
                        </span>
                        <span className={`${style.bg} ${style.text} px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider`}>
                            {status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {bid.office}
                        </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {bid.title}
                    </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-slate-100 pt-4 flex flex-col gap-2">
                    {stages.map((s) => (
                        <a
                            key={s.stage}
                            href={s.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors group"
                        >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                {s.label}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                                <FileText className="w-4 h-4" />
                                View PDF
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
