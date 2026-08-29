import { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/ui/SubpageHero";
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scale,
  ExternalLink,
  HeartHandshake,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageHero>
        <SubpageHero.Badges>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            Civic Tech Project
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>About BetterIliganCity.org</SubpageHero.Title>
        <SubpageHero.Description>
          A volunteer-led initiative building digital public goods for the City
          of Majestic Waterfalls.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[800px] space-y-12 px-4 py-12 md:space-y-16 md:px-6">
        {/* 1. Our Mission */}
        <section className="space-y-6 text-center">
          <div className="mb-2 inline-flex items-center justify-center rounded-2xl bg-blue-100 p-4 text-blue-600">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Our Mission
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            BetterIliganCity is a volunteer-led tech initiative committed to
            creating{" "}
            <strong className="text-blue-600">#civictechprojects</strong> aimed
            at making local government more transparent, efficient, and
            accessible to the citizens of Iligan.
          </p>
        </section>

        {/* 2. Our Goals */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h3 className="mb-6 border-b border-slate-100 pb-4 text-2xl font-bold text-slate-900">
            Our Goals
          </h3>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {[
              "Building a volunteer-run website that reflects Iligan's values and culture.",
              "Open Source and Open Data projects for better local collaboration.",
              "Creating intuitive navigation to find local services quickly.",
              "Ensuring accessibility for all citizens, including those with disabilities.",
              "Providing accurate, up-to-date information about LGU services.",
              "Establishing a model for how local digital governance should work.",
            ].map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="leading-relaxed text-slate-600">{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Why We're Building This */}
        <section className="space-y-6 px-2 md:px-0">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-slate-900">
              Why We&apos;re Building This
            </h3>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Finding local government contact numbers, utility rates, and
              service procedures in Iligan can be fragmented and difficult. The
              current state of many public portals presents numerous challenges
              for citizens:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Information is often outdated, leaving citizens without the most
                current service details.
              </li>
              <li>
                Navigation is complex, making it hard to find straightforward
                pathways to essential needs.
              </li>
              <li>
                A lack of consistent design and accessibility features creates
                barriers for inclusive digital access.
              </li>
            </ul>
            <p>
              These issues create real-world barriers for citizens trying to
              access essential local government services. By addressing them
              here, we hope to create a more unified and effective digital
              presence for Iligan City.
            </p>
          </div>
        </section>

        {/* 4. The BetterGov Parent Initiative */}
        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-10">
          <div className="mb-4 flex items-center gap-3">
            <HeartHandshake className="h-7 w-7 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900 md:text-2xl">
              Proudly Supported by BetterGov
            </h3>
          </div>
          <p className="mb-6 leading-relaxed text-blue-800">
            BetterIliganCity is part of a larger, nationwide movement of citizen
            builders. Our overarching goal is to support, promote, consolidate,
            and empower developers across the Philippines to build impactful
            civic tech projects.
          </p>
          <div className="mb-6 rounded-2xl bg-white/60 p-5">
            <h4 className="mb-3 text-sm font-bold tracking-wider text-blue-900 uppercase">
              For Citizen Builders, BetterGov Provides:
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-blue-800 sm:grid-cols-2">
              <li>• Infrastructure & Tools (Servers, AI Credits)</li>
              <li>• Tech Hackathons & Collaboration</li>
              <li>• Data & APIs for Gov Services</li>
              <li>• Team Matching & Networking</li>
              <li>• Industry Mentorship</li>
              <li>• Physical Office Space</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://about.bettergov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white transition-colors hover:bg-blue-700"
            >
              About BetterGov <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://bettergov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 font-bold text-blue-700 transition-colors hover:bg-blue-100"
            >
              Visit BetterGov.ph <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* 5. Our Commitment (The Passion Section) */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl md:p-12">
          <Flame className="absolute -right-6 -bottom-6 h-48 w-48 text-white opacity-5" />
          <h3 className="mb-6 text-2xl font-black tracking-widest text-amber-500 uppercase">
            Our Commitment
          </h3>
          <div className="space-y-4 text-lg leading-relaxed font-medium text-slate-300">
            <p className="mb-2 text-2xl font-bold text-white">
              WE&apos;RE DONE WAITING.
            </p>
            <p>
              We&apos;re angry. You&apos;re angry. But we can contribute in our
              own ways — no matter how little it is. We can do amazing things
              together. Grassroots style. Open source. No permission needed.
            </p>
            <p>
              We are committed to putting time, resources, and money into this
              initiative. We will keep building relentlessly without
              anyone&apos;s permission. Open source, public, high-quality sites.
            </p>
            <p className="mt-6 border-t border-slate-700 pt-4 text-xl font-bold text-white">
              WE&apos;RE LOOKING FOR PEOPLE SMARTER THAN US!
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-sm md:p-12">
          <div className="mb-5 inline-flex items-center justify-center rounded-full bg-emerald-100 p-3 text-emerald-600">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="mb-4 text-2xl font-extrabold text-emerald-950 md:text-3xl">
            Ready to Make an Impact?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-emerald-800">
            Whether you're a developer, designer, researcher, or just someone
            who wants to help verify local data—we need you. Join our community
            of citizen builders and help shape the digital future of Iligan
            City.
          </p>
          <Link
            href="/volunteer"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
          >
            Join as a Volunteer
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* 6. License */}
        <section className="border-t border-slate-200 pt-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-3 text-slate-500">
            <Scale className="h-6 w-6" />
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">
            Open Source License
          </h4>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500">
            This project's source code is released under the{" "}
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600"
            >
              MIT License
            </a>
            . This means you are free to use, copy, modify, merge, publish,
            distribute, sublicense, and/or sell copies of the software, provided
            that the original copyright notice and permission notice are
            included in all copies or substantial portions of the software.
          </p>
        </section>
      </div>
    </main>
  );
}
