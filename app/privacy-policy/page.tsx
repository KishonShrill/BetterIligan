import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for BetterIliganCity.org detailing how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Go Home" />
      <SubpageHero>
        <SubpageHero.Badges>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>
        </SubpageHero.Badges>
        <SubpageHero.Title>Privacy Policy</SubpageHero.Title>
        <SubpageHero.Description>
          Last updated: June 9, 2025
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[800px] px-4 py-12 md:px-6">
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-600 shadow-sm md:p-10">
          <p className="text-lg">
            This Privacy Policy describes how BetterIliganCity.org
            (&quot;we&quot;) collects, uses, and protects your data on our
            website{" "}
            <a
              href="http://betteriligancity.org/"
              className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              http://betteriligancity.org/
            </a>
            .
          </p>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              1. Data We Collect
            </h2>
            <p>We collect the following data: no data is collected.</p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              2. Use of Data
            </h2>
            <p>
              Collected data is used to provide services, improve the website,
              and for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              3. Data Protection
            </h2>
            <p>
              We implement technical and organizational measures to protect your
              data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              4. Sharing Data with Third Parties
            </h2>
            <p>
              We do not share your data with third parties, except as required
              by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              5. Your Rights
            </h2>
            <p>
              You may request access, correction, or deletion of your data by
              contacting us at:{" "}
              <a
                href="mailto:reports@betteriligancity.org"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                reports@betteriligancity.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              6. Contact Us
            </h2>
            <p>
              If you have any questions, please contact us at:{" "}
              <a
                href="mailto:reports@betteriligancity.org"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                reports@betteriligancity.org
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
