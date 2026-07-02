import { ExternalLink, FileText, Scale } from 'lucide-react';
import { Resolution } from '@/validations/resolutionSchema';

const CATEGORY_STYLES: Record<Resolution['category'], { bg: string; text: string }> = {
    'General Public Services': { bg: 'bg-slate-50', text: 'text-slate-600' },
    'Social Services': { bg: 'bg-rose-50', text: 'text-rose-600' },
    'Economic Services': { bg: 'bg-violet-50', text: 'text-violet-600' },
    'Debt Service': { bg: 'bg-amber-50', text: 'text-amber-600' },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ResolutionCard({ resolution }: { resolution: Resolution }) {
    const style = CATEGORY_STYLES[resolution.category];
    const TypeIcon = resolution.type === 'ordinance' ? Scale : FileText;

    return (
        <a
            href={resolution.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
        >
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full flex flex-col text-left">
                <div className="flex justify-between items-start mb-4">
                    <div className={`${style.bg} ${style.text} p-3 rounded-xl shrink-0`}>
                        <TypeIcon className="w-5 h-5" />
                    </div>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                        {resolution.type === 'ordinance' ? 'Ordinance' : 'Resolution'} No. {resolution.number}
                    </span>
                </div>

                <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {resolution.category}
                    </p>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-3">
                        {resolution.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {resolution.summary}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Session: {formatDate(resolution.sessionDate)}
                    </span>
                    <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View PDF <ExternalLink className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </a>
    );
}
