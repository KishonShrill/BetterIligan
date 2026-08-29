"use client";

import Link from "next/link";
import {
  FileText,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Users,
  AlertTriangle,
} from "lucide-react";
import { AllService } from "@/validations/serviceSchema";
import { serviceCategories } from "@/data/categories";

interface ServiceCardProps {
  service: AllService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const isExternal = service.type === "external";
  const isInternal = service.type === "internal";

  const matchedCategory = serviceCategories.find(
    (c) => c.name === service.category || c.slug === service.category,
  );

  const CategoryIcon = matchedCategory?.icon || FileText;

  const CardContent = (
    <div className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md md:p-6">
      {/* Top Row: Icon & Dynamic Status Pills */}
      <div className="mb-4 flex items-start justify-between md:mb-6">
        <div
          className={`${matchedCategory?.secondaryColor} ${matchedCategory?.primaryColor} shrink-0 rounded-xl p-3 transition-colors`}
        >
          <CategoryIcon className="h-5 w-5" />
        </div>

        {/* Wrap the pills so they don't break the layout if there are many */}
        <div className="flex flex-wrap justify-end gap-2 pl-2">
          {/* --- TRUST LEVEL BADGES (Source) --- */}
          {service.source === "official" && (
            <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-emerald-700 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              Official
            </span>
          )}
          {service.source === "community" && (
            <span className="flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
              Community
            </span>
          )}
          {service.source === "unverified" && (
            <span className="flex items-center gap-1 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
              Unverified
            </span>
          )}

          {/* --- AVAILABILITY BADGES --- */}
          {service.isOnline && (
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-blue-700 uppercase">
              Online
            </span>
          )}
          {service.isWalkIn && (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
              Walk-In
            </span>
          )}
        </div>
      </div>

      {/* Middle Row: Information Block */}
      <div className="flex-1 overflow-hidden">
        <p className="mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {service.category}
        </p>
        <h3 className="mb-2 text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600">
          {service.title}
        </h3>

        {/* Department is only on standard/external */}
        {(service.type === "standard" || service.type === "external") && (
          <p className="line-clamp-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {service.department}
          </p>
        )}

        {/* Internal and Custom Links show descriptions */}
        {(service.type === "internal" || service.type === "custom_link") && (
          <p className="text-xs font-semibold text-slate-500">
            {service.description}
          </p>
        )}

        {/* UPDATED: Dynamic URL resolution display */}
        <p className="mt-0.5 w-full text-xs text-blue-700">
          {service.type === "standard"
            ? `betteriligancity.org/services/${service.slug}`
            : service.type === "internal"
              ? `betteriligancity.org/community/${service.slug}`
              : service.type === "custom_link"
                ? `betteriligancity.org${service.href}`
                : service.externalUrl}
        </p>
      </div>

      {/* Bottom Row: Redirection Indicator & CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 md:mt-6">
        {/* Dynamic Status Indicator */}
        {service.source === "official" && (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              {isExternal ? "Official Portal" : "Official Data"}
            </span>
          </div>
        )}

        {service.source === "community" && (
          <div className="flex items-center gap-1.5 text-purple-600">
            {/* Using a generic Users icon or FileText to represent community effort */}
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              {isExternal ? "Community Link" : "Community Data"}
            </span>
          </div>
        )}

        {service.source === "unverified" && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              {isExternal ? "Unverified Link" : "Unverified Data"}
            </span>
          </div>
        )}

        {/* Call to Action Right Side */}
        <span className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-all group-hover:gap-2">
          {isExternal ? (
            <>
              Launch <ExternalLink className="h-4 w-4" />
            </>
          ) : isInternal ? (
            <>
              View Profile <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              View <ArrowRight className="h-4 w-4" />
            </>
          )}
        </span>
      </div>
    </div>
  );

  // 1. External Links
  if (service.type === "external") {
    return (
      <a
        href={service.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        {CardContent}
      </a>
    );
  }

  // 2. NEW: Custom Internal Links
  if (service.type === "custom_link") {
    return (
      <Link href={service.href} className="group block h-full">
        {CardContent}
      </Link>
    );
  }

  // 3. Community Profile Links
  if (isInternal) {
    const targetUrl = service.internalUrl
      ? service.internalUrl
      : `/community/${service.slug}`;
    return (
      <Link href={targetUrl} className="group block h-full">
        {CardContent}
      </Link>
    );
  }

  // 4. Standard Service Links (Fallback)
  return (
    <Link href={`/services/${service.slug}`} className="group block h-full">
      {CardContent}
    </Link>
  );
}
