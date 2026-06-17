'use client'

import Link from 'next/link';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { Calculator, Zap, Globe, Facebook } from 'lucide-react';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

export default function ElectricityClient() {
    const facebookElectricityPriceLink = "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Filiganlight%2Fposts%2Fpfbid0PjxDUqwHKkZ2ZS9jhzmYXtjzLN1oMpuBg5c6EGvARQcJrPrj3kb9yt2DJpb8tdsMl&show_text=true&width=500"
    const electricityReferences = [
        {
            title: "Official Website of Iligan Light & Power, Inc. (ILPI)",
            url: "https://www.iliganlight.com/"
        },
        {
            title: "Basilio, L., & Cabasan, J. (2004). Local governance and the challenges of economic distress: The case of Iligan City (Discussion Paper Series No. 2004-45). Philippine Institute for Development Studies.",
            url: "https://pidswebs.pids.gov.ph/CDN/PUBLICATIONS/pidsdps0445.pdf"
        },
        {
            title: "Rosagaron, R. P. (2001). Lake Lanao: Its past and present status. In C. B. Santiago, M. L. Cuvin-Aralar, & Z. U. Basiao (Eds.), Conservation and ecological management of Philippine lakes in relation to fisheries and aquaculture (pp. 29–39). Southeast Asian Fisheries Development Center.",
            url: "https://repository.seafdec.org.ph/bitstream/handle/10862/822/cemplrfa_p029-039.pdf"
        },
        {
            title: "National Power Corporation. (n.d.). Dam sites – Agus VII hydroelectric plant.",
            url: "https://www.napocor.gov.ph/dam-sites-agus-vii-hydroelectric-plant/"
        },
        {
            title: "National Power Corporation. (n.d.). Mindanao generation plants.",
            url: "https://www.napocor.gov.ph/mindanao-generation-plants/"
        },
        {
            title: "National Power Corporation. (2021). Executive summary: Agus hydroelectric power plants.",
            url: "https://eia.emb.gov.ph/wp-content/uploads/2022/09/Executive-Summary-English.pdf"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/' text='Go Home' />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-100">
                        Public Utilities
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Electricity & Power</SubpageHero.Title>
                <SubpageHero.Description>
                    Information regarding power generation, management, and distribution in Iligan City, including the Iligan Light & Power, Inc. (ILPI).
                </SubpageHero.Description>
            </SubpageHero>

            {/* 2. Main Layout Container */}
            <div className="max-w-404 mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Side: Information Content (Takes up 8 columns) */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Section: Overview/Management */}
                        <div className="md:bg-white md:border md:border-slate-200 rounded-2xl md:p-8 md:shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Power Generation & Management</h2>

                            <div className="space-y-6">
                                {/* Intro Paragraph */}
                                <p className="text-slate-600 leading-relaxed">
                                    Power in Iligan City is primarily generated through a massive network of hydroelectric power plants that harness the kinetic energy of flowing water. The utilization of these resources began in 1952, providing affordable electricity that rapidly accelerated the city's industrialization and urbanization.
                                </p>

                                {/* Waterfalls & River Systems */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                        The Natural Source
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Known as "The City of Majestic Waterfalls," Iligan relies heavily on the 320-foot <strong>Maria Cristina Falls</strong>. The primary water source is Lake Lanao, acting as a natural reservoir. Water flows northward through the Agus River, navigating a 702-meter drop over 36.5 kilometers before cascading into Iligan Bay.
                                    </p>
                                </div>

                                {/* Hydroelectric Plants */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                                        Agus Hydroelectric Power Complex
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        The flow of the Agus River is tapped by a cascading series of plants (Agus I, II, IV, V, VI, and VII) with a combined capacity of 746.1 MW. Because they are arranged in a cascade, water is reused by downstream plants to maximize energy production. Three operational plants are located directly within Iligan City:
                                    </p>

                                    {/* Quick Stats Grid for the 3 Iligan Plants */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                            <div className="text-sm font-extrabold text-slate-900">Agus V</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1">55 MW Capacity</div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                            <div className="text-sm font-extrabold text-slate-900">Agus VI</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1">219 MW Capacity</div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                            <div className="text-sm font-extrabold text-slate-900">Agus VII</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1">54 MW Capacity</div>
                                        </div>
                                    </div>
                                </div>

                                {/* National Agencies */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                                        Governing Agencies
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        The <strong>National Power Corporation (NPC)</strong>, a government-owned and controlled corporation attached to the Department of Energy, is mandated to operate, manage, and maintain the Agus Hydropower Complex and its supporting watersheds. The Northern Mindanao Power Corporation also plays a role in providing power alongside the NPC.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section: ILPI */}
                        <div className="md:bg-white md:border md:border-slate-200 md:rounded-2xl md:p-8 md:shadow-sm">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                                    Iligan Light & Power, Inc. (ILPI)
                                </h2>
                            </div>

                            {/* Role Description */}
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Iligan Light & Power, Inc. (ILPI) is the sole private electric distribution utility serving Iligan City. While the national grid and power plants generate the electricity, ILPI is responsible for managing, maintaining, and distributing that power through local power lines directly to residential, commercial, and industrial consumers.
                            </p>

                            {/* Current Rates Facebook Embed */}
                            <div className="sm:bg-slate-50 sm:border sm:border-slate-200 rounded-xl sm:p-6 mb-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Current Electricity Rates
                                </h3>

                                {/* FB Embed Container: 
                                    Replace the src URL with the exact URL of ILPI's latest rate post.
                                    The container handles responsiveness so it doesn't break mobile views. 
                                */}
                                <div className="flex justify-center w-full sm:bg-white sm:rounded-lg sm:border sm:border-slate-200 overflow-hidden min-h-[400px]">
                                    <iframe
                                        src={facebookElectricityPriceLink}
                                        width="100%"
                                        height="600"
                                        style={{ border: "none", overflow: "hidden", maxWidth: "500px" }}
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
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors"
                                >
                                    <Globe className="w-4 h-4" /> Visit Website
                                </a>
                                <a
                                    href="https://www.facebook.com/iliganlight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#ebf4ff] hover:bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe] text-sm font-bold rounded-lg transition-colors"
                                >
                                    <Facebook className="w-4 h-4" /> Facebook Page
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
                    <div className="lg:col-span-3 lg:sticky lg:top-24">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6">

                            {/* Utility Header */}
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                                <Calculator className="w-5 h-5 text-slate-400" />
                                <h3 className="font-bold text-slate-900">Utility Tools</h3>
                            </div>

                            {/* Utility Buttons/Links */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Example Tool Button */}
                                <Link href={"/iligan/electricity/calculator"} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                    <Zap className="w-6 h-6 text-amber-500 mb-2" />
                                    <span className="text-xs font-bold text-slate-700 text-center">Cost Calculator</span>
                                </Link>

                                {/* Placeholder for another tool */}
                                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-colors">
                                    <span className="text-xs font-medium text-slate-500 text-center">More Tools Soon</span>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}
