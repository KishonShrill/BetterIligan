import { Metadata } from 'next';
import Link from 'next/link';
import SubpageHero from '@/components/ui/SubpageHero';
import {
    Target, CheckCircle2, AlertTriangle, Flame,
    Scale, ExternalLink, HeartHandshake, Users,
    ArrowRight, ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'About | BetterIliganCity',
    description: 'Learn about our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageHero>
                <SubpageHero.Badges>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                        Civic Tech Project
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>About BetterIliganCity.org</SubpageHero.Title>
                <SubpageHero.Description>
                    A volunteer-led initiative building digital public goods for the City of Majestic Waterfalls.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[800px] mx-auto px-4 md:px-6 py-12 space-y-12 md:space-y-16">

                {/* 1. Our Mission */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-2xl mb-2">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Mission</h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        BetterIliganCity is a volunteer-led tech initiative committed to creating <strong className="text-blue-600">#civictechprojects</strong> aimed at making local government more transparent, efficient, and accessible to the citizens of Iligan.
                    </p>
                </section>

                {/* 2. Our Goals */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Our Goals</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {[
                            "Building a volunteer-run website that reflects Iligan's values and culture.",
                            "Open Source and Open Data projects for better local collaboration.",
                            "Creating intuitive navigation to find local services quickly.",
                            "Ensuring accessibility for all citizens, including those with disabilities.",
                            "Providing accurate, up-to-date information about LGU services.",
                            "Establishing a model for how local digital governance should work."
                        ].map((goal, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-slate-600 leading-relaxed">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 3. Why We're Building This */}
                <section className="space-y-6 px-2 md:px-0">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        <h3 className="text-2xl font-bold text-slate-900">Why We&apos;re Building This</h3>
                    </div>
                    <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                        <p>
                            Finding local government contact numbers, utility rates, and service procedures in Iligan can be fragmented and difficult. The current state of many public portals presents numerous challenges for citizens:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Information is often outdated, leaving citizens without the most current service details.</li>
                            <li>Navigation is complex, making it hard to find straightforward pathways to essential needs.</li>
                            <li>A lack of consistent design and accessibility features creates barriers for inclusive digital access.</li>
                        </ul>
                        <p>
                            These issues create real-world barriers for citizens trying to access essential local government services. By addressing them here, we hope to create a more unified and effective digital presence for Iligan City.
                        </p>
                    </div>
                </section>

                {/* 4. The BetterGov Parent Initiative */}
                <section className="bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-10">
                    <div className="flex items-center gap-3 mb-4">
                        <HeartHandshake className="w-7 h-7 text-blue-600" />
                        <h3 className="text-xl md:text-2xl font-bold text-blue-900">Proudly Supported by BetterGov</h3>
                    </div>
                    <p className="text-blue-800 leading-relaxed mb-6">
                        BetterIliganCity is part of a larger, nationwide movement of citizen builders. Our overarching goal is to support, promote, consolidate, and empower developers across the Philippines to build impactful civic tech projects.
                    </p>
                    <div className="bg-white/60 rounded-2xl p-5 mb-6">
                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">For Citizen Builders, BetterGov Provides:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                            <li>• Infrastructure & Tools (Servers, AI Credits)</li>
                            <li>• Tech Hackathons & Collaboration</li>
                            <li>• Data & APIs for Gov Services</li>
                            <li>• Team Matching & Networking</li>
                            <li>• Industry Mentorship</li>
                            <li>• Physical Office Space</li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a href="https://about.bettergov.ph/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                            About BetterGov <ExternalLink className="w-4 h-4" />
                        </a>
                        <a href="https://bettergov.ph/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition-colors">
                            Visit BetterGov.ph <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </section>

                {/* 5. Our Commitment (The Passion Section) */}
                <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                    <Flame className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-5" />
                    <h3 className="text-2xl font-black uppercase tracking-widest text-amber-500 mb-6">Our Commitment</h3>
                    <div className="space-y-4 text-lg text-slate-300 leading-relaxed font-medium">
                        <p className="text-2xl font-bold text-white mb-2">
                            WE&apos;RE DONE WAITING.
                        </p>
                        <p>
                            We&apos;re angry. You&apos;re angry. But we can contribute in our own ways — no matter how little it is. We can do amazing things together. Grassroots style. Open source. No permission needed.
                        </p>
                        <p>
                            We are committed to putting time, resources, and money into this initiative. We will keep building relentlessly without anyone&apos;s permission. Open source, public, high-quality sites.
                        </p>
                        <p className="text-xl font-bold text-white mt-6 pt-4 border-t border-slate-700">
                            WE&apos;RE LOOKING FOR PEOPLE SMARTER THAN US!
                        </p>
                    </div>
                </section>

                <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 md:p-12 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-5">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mb-4">Ready to Make an Impact?</h3>
                    <p className="text-lg text-emerald-800 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Whether you're a developer, designer, researcher, or just someone who wants to help verify local data—we need you. Join our community of citizen builders and help shape the digital future of Iligan City.
                    </p>
                    <Link
                        href="/volunteer"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        Join as a Volunteer
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>

                {/* 6. License */}
                <section className="pt-8 border-t border-slate-200 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-slate-100 text-slate-500 rounded-full mb-4">
                        <Scale className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Open Source License</h4>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                        This project's source code is released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-blue-600 underline decoration-slate-300 underline-offset-2">MIT License</a>. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided that the original copyright notice and permission notice are included in all copies or substantial portions of the software.
                    </p>
                </section>

            </div>
        </main>
    );
}
