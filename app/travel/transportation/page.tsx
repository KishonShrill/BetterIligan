import {
  Bus,
  CalendarClock,
  MapPin,
  Phone,
  Users,
  BusFront,
  HardHat,
} from "lucide-react";
import SubpageHero from "@/components/ui/SubpageHero";

export default function TransportationCharters() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageHero>
        <SubpageHero.Badges>
          <div className="flex gap-4 lg:mx-auto">
            <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              <HardHat className="h-3.5 w-3.5" /> Page is Under Construction
            </span>
            <span className="flex w-fit items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-700 uppercase">
              <BusFront className="h-3.5 w-3.5" />
              Transport Guide
            </span>
          </div>
        </SubpageHero.Badges>
        <SubpageHero.Title className="lg:text-center">
          Transportation
        </SubpageHero.Title>
      </SubpageHero>

      <section className="container mx-auto mt-16 px-4">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Charters & Vehicle Rentals
          </h2>
          <p className="mt-1 text-slate-500">
            Private transport options for group events, outings, and company
            trips.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* MITSCO Mini Bus Card */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg leading-tight font-bold text-slate-900">
                    MITSCO Mini Bus
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Metro Iligan Transport Service Cooperative
                  </p>
                </div>
              </div>
              <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                Co-op Managed
              </span>
            </div>

            <div className="mb-6 flex-1 space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>Serving Iligan City and nearby areas</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>
                  Ideal for Outings, Events, Company Trips & Family Travel
                </span>
              </div>

              {/* Highlighted Rule */}
              <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50 p-2.5 text-sm text-amber-700">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span className="font-medium">
                  Advance booking required at least 3 days before departure.
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Contact to Book
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="tel:+639942269218"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  +63 994 226 9218
                </a>
                <a
                  href="tel:+639924898199"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  369924898199
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
