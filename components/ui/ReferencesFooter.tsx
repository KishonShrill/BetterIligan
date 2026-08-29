import React from "react";
import { ExternalLink } from "lucide-react";

// 1. Define the TypeScript types for your JSON data
export interface ReferenceItem {
  title: string;
  url: string;
}

interface ReferencesFooterProps {
  references: ReferenceItem[];
  disclaimer?: string;
  className?: string;
}

export default function ReferencesFooter({
  references,
  disclaimer,
  className,
}: ReferencesFooterProps) {
  // If there are no references, don't render the footer at all
  if (!references || references.length === 0) return null;

  return (
    <div className={`mt-8 border-t border-slate-200 pt-8 ${className}`}>
      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase">
        Sources & References
      </h3>
      <ul className="space-y-3">
        {references.map((ref, idx) => (
          <li key={idx}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-500" />
              <span>{ref.title}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Only render the disclaimer if one is provided */}
      {disclaimer && (
        <p className="mt-6 text-xs text-slate-400 italic">{disclaimer}</p>
      )}
    </div>
  );
}
