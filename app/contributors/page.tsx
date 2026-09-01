import { Metadata } from "next";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { Users } from "lucide-react";
import ContributorsClient from "./ContributorsClient";

export const metadata: Metadata = {
  title: "Contributors",
  description:
    "Meet the developers, maintainers, and community volunteers building BetterIliganCity.",
};

export default function ContributorsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Back to Home" />

      <SubpageHero>
        <SubpageHero.Badges>
          <span className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            <Users className="h-3.5 w-3.5" />
            Our Team
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title className="text-center">
          The People Behind BetterIligan
        </SubpageHero.Title>
        <SubpageHero.Description className="mx-auto text-center">
          Meet the developers, maintainers, and everyday citizens working
          together to build a better digital infrastructure for our city.
        </SubpageHero.Description>
      </SubpageHero>

      <ContributorsClient />
    </main>
  );
}
