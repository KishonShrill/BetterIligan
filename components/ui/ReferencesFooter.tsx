import React from 'react';
import { ExternalLink } from 'lucide-react';

// 1. Define the TypeScript types for your JSON data
export interface ReferenceItem {
    title: string;
    url: string;
}

interface ReferencesFooterProps {
    references: ReferenceItem[];
    disclaimer?: string;
}

export default function ReferencesFooter({ references, disclaimer }: ReferencesFooterProps) {
    // If there are no references, don't render the footer at all
    if (!references || references.length === 0) return null;

    return (
        <div className="pt-8 mt-8 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Sources & References
            </h3>
            <ul className="space-y-3">
                {references.map((ref, idx) => (
                    <li key={idx}>
                        <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                            <span>{ref.title}</span>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Only render the disclaimer if one is provided */}
            {disclaimer && (
                <p className="text-xs text-slate-400 mt-6 italic">
                    {disclaimer}
                </p>
            )}
        </div>
    );
}
