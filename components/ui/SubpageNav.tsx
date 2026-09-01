"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SubpageNavProps {
  text?: string; // Optional: Defaults to "Go Back"
  href?: string; // Optional: If provided, it becomes a Link. If not, it becomes a back button.
  className?: string;
}

export default function SubpageNav({
  text = "Go Back",
  href,
  className,
}: SubpageNavProps) {
  const interactionClasses =
    "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors";

  return (
    <div
      className={`border-b border-slate-200 bg-white md:hidden ${className}`}
    >
      {/* Standardized width to match your SubpageHero perfectly */}
      <div className="container mx-auto px-4 py-4 md:px-6">
        {href ? (
          <Link href={href} className={interactionClasses}>
            <ArrowLeft className="h-4 w-4" />
            {text}
          </Link>
        ) : (
          <button
            onClick={() => window.history.back()}
            className={interactionClasses}
          >
            <ArrowLeft className="h-4 w-4" />
            {text}
          </button>
        )}
      </div>
    </div>
  );
}
