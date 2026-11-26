import Image from "next/image";
import Link from "next/link";
import type { Step } from "./types";
import { cn } from "@/lib/utils";
import { parseDescription } from "@/lib/parseDescription";

interface StepCardProps {
  step: Step;
  className?: string;
  index: number;
  length: number;
}

export default function StepCard({
  step,
  className,
  index,
  length,
}: StepCardProps) {
  const hasMedia = step.media !== null;

  return (
    <div
      id={step.id}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8",
        className,
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          hasMedia && "lg:grid-cols-[280px_1fr]",
        )}
      >
        {/* Left: Text Content */}
        <div className="space-y-4">
          <span className="text-sm font-bold text-slate-600">
            STEP {index + 1} OF {length}
          </span>
          <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
          <p className="leading-relaxed text-slate-600">
            {parseDescription(step.description)}
          </p>
        </div>

        {/* Right: Media (if present) */}
        {step.media && (
          <div className="flex items-start">
            {step.media.type === "image" && (
              <div className="relative w-full overflow-hidden rounded-lg border border-slate-200">
                <Link href={step.media.src} target="_blank">
                  <Image
                    src={step.media.src}
                    alt={step.media.alt}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </Link>
              </div>
            )}
            {step.media.type === "youtube" && (
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
                <iframe
                  src={`https://www.youtube.com/embed/${step.media.src}`}
                  title={step.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
