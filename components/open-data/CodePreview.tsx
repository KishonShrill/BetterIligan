"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CodePreviewProps {
  title: string;
  code: string;
  language?: string;
}

export default function CodePreview({ title, code }: CodePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
      >
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>
      {isExpanded && (
        <pre className="custom-scrollbar overflow-x-auto bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-300">
          {code}
        </pre>
      )}
    </div>
  );
}
