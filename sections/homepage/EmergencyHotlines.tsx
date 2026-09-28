"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  LifeBuoy,
  Flame,
  Shield,
  Cross,
  ArrowUpRight,
  X,
} from "lucide-react";
import Button3D from "@/components/ui/Button3D";

function telHref(display: string): string {
  const cleaned = display.replace(/[^+\d]/g, "");
  return `tel:${cleaned.length === 7 ? `063${cleaned}` : cleaned}`;
}

const CONTACTS = [
  {
    label: "National Emergency",
    number: "911",
    Icon: Phone,
    color: "#dc2626",
  },
  {
    label: "Rescue / CDRRMO",
    number: "811",
    Icon: LifeBuoy,
    color: "#059669",
  },
  {
    label: "Fire Department",
    number: "160",
    Icon: Flame,
    color: "#ea580c",
  },
  {
    label: "Police Department",
    number: "167",
    Icon: Shield,
    color: "#2563eb",
  },
  {
    label: "Ambulance",
    number: "221-0081",
    Icon: Cross,
    color: "#dc2626",
  },
];

export default function EmergencyHotlines() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent the page from scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open emergency hotlines"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed right-4 bottom-4 z-40 flex cursor-pointer items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-[1.03] hover:bg-red-700 hover:shadow-xl active:scale-95 sm:right-6 sm:bottom-6 sm:px-5 sm:py-3.5"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30" />

          <Phone className="relative h-4 w-4" strokeWidth={2.5} />
        </span>

        <span className="hidden sm:inline">Emergency Hotlines</span>

        <span className="sm:hidden">Emergency</span>
      </button>

      <div
        className={`fixed inset-0 z-[100] flex items-end justify-center p-0 transition-all duration-300 ease-out sm:items-center sm:p-6 ${
          isOpen
            ? "pointer-events-auto bg-slate-950/50 opacity-100 backdrop-blur-[2px]"
            : "backdrop-blur-0 pointer-events-none bg-slate-950/0 opacity-0"
        }`}
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-hotlines-title"
          className={`relative max-h-[92vh] w-full overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-3xl sm:rounded-3xl ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
            <div className="pr-8">
              <p className="mb-1 text-[10px] font-bold tracking-widest text-red-600 uppercase sm:text-xs">
                Emergency Services
              </p>

              <h2
                id="emergency-hotlines-title"
                className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Emergency Hotlines
              </h2>

              <p className="mt-1.5 max-w-xl text-sm leading-5 text-slate-500 sm:text-base">
                Tap any number below to call instantly from your mobile device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close emergency hotlines"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(92vh-180px)] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTACTS.map(({ label, number, Icon, color }) => (
                <a
                  key={label}
                  href={telHref(number)}
                  aria-label={`Call ${label} at ${number}`}
                  className="group relative flex min-h-[96px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.99] sm:p-5"
                >
                  {/* Icon */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${color}1a`,
                      borderColor: `${color}33`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} aria-hidden />
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {label}
                    </p>

                    <h3 className="text-xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                      {number}
                    </h3>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Tap to call
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" />
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Want to be prepared?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Learn what to do before, during, and after disasters.
                </p>
              </div>

              <Button3D
                text="Disaster Preparedness Hub"
                href="/disaster"
                hasArrow={true}
                size="sm"
                variant="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
