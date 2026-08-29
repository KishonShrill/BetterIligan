"use client";

import Link from "next/link";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { Calculator, Zap, Globe, Facebook } from "lucide-react";
import ReferencesFooter from "@/components/ui/ReferencesFooter";

export default function ElectricityClient() {
  const facebookElectricityPriceLink =
    "https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/iliganlight/posts/pfbid0abarTk5N4MoY728uig3EgzURrhRKLucpdeRvzLhuQd2g5aBB6Y5kHqep1kfiD7C6l&show_text=true&width=500";
  const electricityReferences = [
    {
      title: "Official Website of Iligan Light & Power, Inc. (ILPI)",
      url: "https://www.iliganlight.com/",
    },
    {
      title:
        "Basilio, L., & Cabasan, J. (2004). Local governance and the challenges of economic distress: The case of Iligan City (Discussion Paper Series No. 2004-45). Philippine Institute for Development Studies.",
      url: "https://pidswebs.pids.gov.ph/CDN/PUBLICATIONS/pidsdps0445.pdf",
    },
    {
      title:
        "Rosagaron, R. P. (2001). Lake Lanao: Its past and present status. In C. B. Santiago, M. L. Cuvin-Aralar, & Z. U. Basiao (Eds.), Conservation and ecological management of Philippine lakes in relation to fisheries and aquaculture (pp. 29–39). Southeast Asian Fisheries Development Center.",
      url: "https://repository.seafdec.org.ph/bitstream/handle/10862/822/cemplrfa_p029-039.pdf",
    },
    {
      title:
        "National Power Corporation. (n.d.). Dam sites – Agus VII hydroelectric plant.",
      url: "https://www.napocor.gov.ph/dam-sites-agus-vii-hydroelectric-plant/",
    },
    {
      title: "National Power Corporation. (n.d.). Mindanao generation plants.",
      url: "https://www.napocor.gov.ph/mindanao-generation-plants/",
    },
    {
      title:
        "National Power Corporation. (2021). Executive summary: Agus hydroelectric power plants.",
      url: "https://eia.emb.gov.ph/wp-content/uploads/2022/09/Executive-Summary-English.pdf",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Go Home" />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold tracking-wider text-amber-700 uppercase">
            Public Utilities
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Electricity & Power</SubpageHero.Title>
        <SubpageHero.Description>
          Information regarding power generation, management, and distribution
          in Iligan City, including the Iligan Light & Power, Inc. (ILPI).
        </SubpageHero.Description>
      </SubpageHero>

      {/* 2. Main Layout Container */}
      <div className="mx-auto max-w-404 px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col-reverse items-start gap-8 lg:grid lg:grid-cols-12">
          {/* Left Side: Information Content (Takes up 8 columns) */}
          <div className="space-y-8 lg:col-span-9">
            {/* Section: Overview/Management */}
            <div
              id="power-generation-and-management"
              className="scroll-mt-24 rounded-2xl md:border md:border-slate-200 md:bg-white md:p-8 md:shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Power Generation & Management
              </h2>

              <div className="space-y-6">
                {/* Intro Paragraph */}
                <p className="leading-relaxed text-slate-600">
                  Power in Iligan City is primarily generated through a massive
                  network of hydroelectric power plants that harness the kinetic
                  energy of flowing water. The utilization of these resources
                  began in 1952, providing affordable electricity that rapidly
                  accelerated the city's industrialization and urbanization.
                </p>

                {/* Waterfalls & River Systems */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
                    The Natural Source
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Known as "The City of Majestic Waterfalls," Iligan relies
                    heavily on the 320-foot{" "}
                    <strong>Maria Cristina Falls</strong>. The primary water
                    source is Lake Lanao, acting as a natural reservoir. Water
                    flows northward through the Agus River, navigating a
                    702-meter drop over 36.5 kilometers before cascading into
                    Iligan Bay.
                  </p>
                </div>

                {/* Hydroelectric Plants */}
                <div>
                  <h3 className="mb-3 text-lg font-bold text-slate-800">
                    Agus Hydroelectric Power Complex
                  </h3>
                  <p className="mb-4 leading-relaxed text-slate-600">
                    The flow of the Agus River is tapped by a cascading series
                    of plants (Agus I, II, IV, V, VI, and VII) with a combined
                    capacity of 746.1 MW. Because they are arranged in a
                    cascade, water is reused by downstream plants to maximize
                    energy production. Three operational plants are located
                    directly within Iligan City:
                  </p>

                  {/* Quick Stats Grid for the 3 Iligan Plants */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                      <div className="text-sm font-extrabold text-slate-900">
                        Agus V
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        55 MW Capacity
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                      <div className="text-sm font-extrabold text-slate-900">
                        Agus VI
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        219 MW Capacity
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                      <div className="text-sm font-extrabold text-slate-900">
                        Agus VII
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        54 MW Capacity
                      </div>
                    </div>
                  </div>
                </div>

                {/* National Agencies */}
                <div>
                  <h3 className="mb-2 text-lg font-bold text-slate-800">
                    Governing Agencies
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    The <strong>National Power Corporation (NPC)</strong>, a
                    government-owned and controlled corporation attached to the
                    Department of Energy, is mandated to operate, manage, and
                    maintain the Agus Hydropower Complex and its supporting
                    watersheds. The Northern Mindanao Power Corporation also
                    plays a role in providing power alongside the NPC.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: ILPI */}
            <div
              id="ilpi"
              className="scroll-mt-24 md:rounded-2xl md:border md:border-slate-200 md:bg-white md:p-8 md:shadow-sm"
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-amber-100 p-2 text-amber-600">
                  <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-2xl leading-tight font-bold text-slate-900">
                  Iligan Light & Power, Inc. (ILPI)
                </h2>
              </div>

              {/* Role Description */}
              <p className="mb-6 leading-relaxed text-slate-600">
                Iligan Light & Power, Inc. (ILPI) is the sole private electric
                distribution utility serving Iligan City. While the national
                grid and power plants generate the electricity, ILPI is
                responsible for managing, maintaining, and distributing that
                power through local power lines directly to residential,
                commercial, and industrial consumers.
              </p>

              {/* Current Rates Facebook Embed */}
              <div className="mb-6 rounded-xl sm:border sm:border-slate-200 sm:bg-slate-50 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                  Current Electricity Rates
                </h3>

                {/* FB Embed Container: 
                                    Replace the src URL with the exact URL of ILPI's latest rate post.
                                    The container handles responsiveness so it doesn't break mobile views. 
                                */}
                <div className="flex min-h-[400px] w-full justify-center overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:bg-white">
                  <iframe
                    src={facebookElectricityPriceLink}
                    width="100%"
                    height="600"
                    style={{
                      border: "none",
                      overflow: "hidden",
                      maxWidth: "500px",
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="ILPI Current Rates"
                  ></iframe>
                </div>
              </div>

              {/* Official Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.iliganlight.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 sm:flex-none"
                >
                  <Globe className="h-4 w-4" /> Visit Website
                </a>
                <a
                  href="https://www.facebook.com/iliganlight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#ebf4ff] px-5 py-2.5 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe] sm:flex-none"
                >
                  <Facebook className="h-4 w-4" /> Facebook Page
                </a>
              </div>
            </div>

            {/* --- NEW: References Footer --- */}
            <ReferencesFooter
              references={electricityReferences}
              disclaimer="Disclaimer: The calculator and data provided on this page are for estimation purposes only. Actual billing amounts from ILPI may vary based on generation charges, systems loss, and current taxes."
            />
          </div>

          {/* Right Side: Utility Sidebar (Takes up 4 columns) */}
          <div className="max-lg:mx-auto lg:sticky lg:top-24 lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Utility Header */}
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                <Calculator className="h-5 w-5 text-slate-400" />
                <h3 className="font-bold text-slate-900">Utility Tools</h3>
              </div>

              {/* Utility Buttons/Links */}
              <div className="grid grid-cols-2 gap-3">
                {/* Example Tool Button */}
                <Link
                  href={"/iligan/electricity/calculator"}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <Zap className="mb-2 h-6 w-6 text-amber-500" />
                  <span className="text-center text-xs font-bold text-slate-700">
                    Cost Calculator
                  </span>
                </Link>

                {/* Placeholder for another tool */}
                <button className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300">
                  <span className="text-center text-xs font-medium text-slate-500">
                    More Tools Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
