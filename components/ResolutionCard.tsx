import { ExternalLink, FileText, Scale } from "lucide-react";
import { Resolution } from "@/validations/resolutionSchema";

const CATEGORY_STYLES: Record<
  Resolution["category"],
  { bg: string; text: string }
> = {
  "General Public Services": { bg: "bg-slate-50", text: "text-slate-600" },
  "Social Services": { bg: "bg-rose-50", text: "text-rose-600" },
  "Economic Services": { bg: "bg-violet-50", text: "text-violet-600" },
  "Debt Service": { bg: "bg-amber-50", text: "text-amber-600" },
  "Financial Services": { bg: "bg-emerald-50", text: "text-emerald-600" },
  "Infrastructure and Transport": { bg: "bg-blue-50", text: "text-blue-600" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ResolutionCard({
  resolution,
}: {
  resolution: Resolution;
}) {
  const style = CATEGORY_STYLES[resolution.category];
  const TypeIcon = resolution.type === "ordinance" ? Scale : FileText;

  return (
    <a
      href={resolution.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md md:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className={`${style.bg} ${style.text} shrink-0 rounded-xl p-3`}>
            <TypeIcon className="h-5 w-5" />
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
            {resolution.type === "ordinance" ? "Ordinance" : "Resolution"} No.{" "}
            {resolution.number}
          </span>
        </div>

        <div className="flex-1">
          <p className="mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            {resolution.category}
          </p>
          <div className="group/title-tooltip relative mb-2 cursor-help">
            <h3 className="line-clamp-3 text-base leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600">
              {resolution.title}
            </h3>

            {/* Title Tooltip Overlay (Blue Theme) */}
            <div className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl bg-blue-600 p-3 text-xs leading-relaxed font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover/title-tooltip:visible group-hover/title-tooltip:opacity-100 sm:w-72">
              {resolution.title}
              {/* Blue triangle arrow */}
              <div className="absolute top-full left-4 -mt-px border-[6px] border-transparent border-t-blue-600"></div>
            </div>
          </div>
          {/* ADDED: Tooltip Wrapper with a named group */}
          <div className="group/tooltip relative cursor-help">
            <p className="line-clamp-2 text-sm text-slate-500">
              {resolution.summary}
            </p>

            {/* ADDED: The Tooltip Overlay */}
            <div className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl bg-slate-900 p-3 text-xs leading-relaxed text-white opacity-0 shadow-xl transition-all duration-200 group-hover/tooltip:visible group-hover/tooltip:opacity-100 sm:w-72">
              {resolution.summary}

              {/* Little triangle arrow pointing down */}
              <div className="absolute top-full left-4 -mt-px border-[6px] border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            Session: {formatDate(resolution.sessionDate)}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-all group-hover:gap-2">
            View PDF <ExternalLink className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
