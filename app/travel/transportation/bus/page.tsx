import { Metadata } from "next";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { BusFront } from "lucide-react";
import BusScheduleClient from "./BusScheduleClient";

export const metadata: Metadata = {
  title: "Bus Schedules",
  description:
    "Daily schedules for Rural Transit and Super 5 buses traveling to and from Iligan City.",
};

export default function BusSchedulesPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/travel/transportation" text="Back to Transportation" />

      <SubpageHero>
        <SubpageHero.Badges>
          <span className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-700 uppercase">
            <BusFront className="h-3.5 w-3.5" />
            Terminal Guide
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title className="text-center">
          Bus Schedules
        </SubpageHero.Title>
        <SubpageHero.Description className="mx-auto text-center">
          Check departure times for trips connecting Iligan City to Cagayan de
          Oro, Marawi, and beyond.
        </SubpageHero.Description>
      </SubpageHero>

      <BusScheduleClient />
    </main>
  );
}
