"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Bid, getBidStatus, sortStages } from "@/validations/bidSchema";

const STATUS_STYLES: Record<
  ReturnType<typeof getBidStatus>,
  { bg: string; text: string }
> = {
  "Open for Bidding": { bg: "bg-blue-50", text: "text-blue-700" },
  Awarded: { bg: "bg-amber-50", text: "text-amber-700" },
  Ongoing: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

export default function BidCard({ bid }: { bid: Bid }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = getBidStatus(bid.stages);
  const style = STATUS_STYLES[status];
  const stages = sortStages(bid.stages);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-4 p-4 text-left md:p-6"
      >
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
              {bid.reference}
            </span>
            <span
              className={`${style.bg} ${style.text} rounded-md px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase`}
            >
              {status}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {bid.office}
            </span>
          </div>
          <h3 className="text-base leading-snug font-bold text-slate-900">
            {bid.title}
          </h3>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-4 pt-4 pb-4 md:px-6 md:pb-6">
          {stages.map((s) => (
            <a
              key={s.stage}
              href={s.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition-colors hover:bg-blue-50"
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                {s.label}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <FileText className="h-4 w-4" />
                View PDF
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
