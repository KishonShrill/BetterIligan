import { Fragment } from "react";
import { disasterGuides } from "@/data/disaster";
import type { DisasterGuide } from "@/validations/disasterSchema";
import { CloudRain, Waves, Activity, ChevronDown } from "lucide-react";

// Renders **bolded** key words from the checklist strings so a panicking user
// can skim the critical action words (per PR review). Plain text otherwise.
function renderEmphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const HAZARD_META: Record<
  DisasterGuide["hazard"],
  {
    label: string;
    subtitle: string;
    color: string;
    image: string;
    Icon: typeof CloudRain;
  }
> = {
  typhoon: {
    label: "Typhoon",
    subtitle: "Signals, go-bags, and staying put safely",
    color: "#2563eb",
    image: "/images/disaster/typhoon.svg",
    Icon: CloudRain,
  },
  flood: {
    label: "Flood",
    subtitle: "Move to higher ground, avoid the water",
    color: "#0891b2",
    image: "/images/disaster/flood.svg",
    Icon: Waves,
  },
  earthquake: {
    label: "Earthquake",
    subtitle: "Duck, cover, hold — and after the shaking",
    color: "#d97706",
    image: "/images/disaster/earthquake.svg",
    Icon: Activity,
  },
};

const PHASES = ["before", "during", "after"] as const;
const PHASE_LABELS: Record<(typeof PHASES)[number], string> = {
  before: "Before",
  during: "During",
  after: "After",
};

export default function GuidesSection() {
  return (
    <section aria-labelledby="guides-heading">
      <h2
        id="guides-heading"
        className="mb-2 text-2xl font-bold text-slate-900"
      >
        What to do: Preparedness Guides
      </h2>
      <p className="mb-6 text-slate-600">
        Simple checklists for before, during, and after each hazard — adapted
        from NDRRMC and Philippine Red Cross public guidance.
      </p>

      <div className="space-y-4">
        {disasterGuides.map((guide, i) => {
          const { label, subtitle, color, image, Icon } =
            HAZARD_META[guide.hazard];
          return (
            <details
              key={guide.hazard}
              open={i === 0}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <summary className="cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                {/* Themed illustration header with the hazard title overlaid. */}
                <div className="relative h-28 overflow-hidden sm:h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  <div className="relative flex h-full items-end gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-white" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-extrabold text-white drop-shadow-sm">
                        {label}
                      </span>
                      <span className="block text-xs text-white/85 drop-shadow-sm">
                        {subtitle}
                      </span>
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-white/90 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </div>
                </div>
              </summary>
              <div className="grid gap-6 border-t border-slate-100 px-5 pt-1 pb-6 md:grid-cols-3">
                {PHASES.map((phase) => (
                  <div key={phase}>
                    <h3
                      className="mb-3 pt-4 text-xs font-bold tracking-wider uppercase"
                      style={{ color }}
                    >
                      {PHASE_LABELS[phase]}
                    </h3>
                    <ul className="space-y-2">
                      {guide.phases[phase].map((item, idx) => (
                        <li
                          key={idx}
                          className="border-l-2 pl-3 text-sm leading-relaxed text-slate-600"
                          style={{ borderColor: `${color}40` }}
                        >
                          {renderEmphasis(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
