"use client";

import { Download, FileJson, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatasetCardProps {
  name: string;
  path: string;
  description: string;
  category: string;
  format: "JSON" | "GeoJSON";
  estimatedRecords?: number;
  size?: string;
}

export default function DatasetCard({
  name,
  path,
  description,
  category,
  format,
  estimatedRecords,
  size,
}: DatasetCardProps) {
  const isGeoJSON = format === "GeoJSON";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
                isGeoJSON
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700",
              )}
            >
              {format}
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
        <div
          className={cn(
            "shrink-0 rounded-lg p-2",
            isGeoJSON
              ? "bg-purple-50 text-purple-600"
              : "bg-green-50 text-green-600",
          )}
        >
          {isGeoJSON ? (
            <MapPin className="h-5 w-5" />
          ) : (
            <FileJson className="h-5 w-5" />
          )}
        </div>
      </div>

      {(estimatedRecords || size) && (
        <div className="mb-4 flex gap-4 text-xs text-slate-500">
          {estimatedRecords && (
            <span>
              <strong className="font-semibold text-slate-700">
                {estimatedRecords}
              </strong>{" "}
              records
            </span>
          )}
          {size && (
            <span>
              <strong className="font-semibold text-slate-700">{size}</strong>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          View Raw
        </a>
        <a
          href={path}
          download
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </div>
  );
}
