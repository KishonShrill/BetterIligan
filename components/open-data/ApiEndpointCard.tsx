"use client";

import { Code } from "lucide-react";

interface ApiEndpointCardProps {
  name: string;
  endpoint: string;
  description: string;
  category: string;
}

export default function ApiEndpointCard({
  name,
  endpoint,
  description,
  category,
}: ApiEndpointCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              GET
            </span>
            <span className="text-xs font-medium text-slate-500">
              {category}
            </span>
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">{name}</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
          <Code className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="group/code relative overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2">
            <span className="text-xs font-medium text-slate-400">Endpoint</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://betteriligancity.org${endpoint}`,
                );
              }}
              className="text-xs text-slate-400 transition-colors hover:text-white"
            >
              Copy
            </button>
          </div>
          <a
            href={endpoint}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 font-mono text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            {endpoint}
          </a>
        </div>
      </div>
    </div>
  );
}
