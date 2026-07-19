import { Metadata } from 'next';
import { safeJsonLd } from '@/lib/utils';
import SubpageHero from '@/components/ui/SubpageHero';
import {
    Code2,
    PenTool,
    Megaphone,
    Landmark,
    SearchCheck,
    HeartHandshake
} from 'lucide-react';
import VolunteerModalClient from './VolunteerModalClient';

export const metadata: Metadata = {
    title: 'Volunteer',
    description: 'Join our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible.',
};

export default function VolunteerPage() {
    // JSON-LD to establish BetterIliganCity as a civic organization 
    // and explicitly link it to the national BetterGov Philippines initiative.
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Volunteer for BetterIliganCity",
        "description": "Information on how to volunteer, contribute code, or verify data for the BetterIliganCity civic tech project.",
        "url": "https://betteriligancity.org/volunteer",
        "about": {
            "@type": "NGO",
            "name": "BetterIliganCity",
            "description": "A volunteer-led civic tech initiative building digital public goods for Iligan City.",
            "location": {
                "@type": "Place",
                "name": "Iligan City, Northern Mindanao, Philippines"
            },
            "parentOrganization": {
                "@type": "NGO",
                "name": "BetterGov Philippines",
                "url": "https://bettergov.ph/"
            }
        },
        "potentialAction": {
            "@type": "JoinAction",
            "name": "Join BetterIliganCity Community",
            "target": "https://discord.gg/bettergovph"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />
            <main className="min-h-screen bg-slate-50 font-sans pb-24 relative">

                <SubpageHero>
                    <SubpageHero.Badges>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100 flex items-center gap-1.5 w-fit mx-auto">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            Join the Movement
                        </span>
                    </SubpageHero.Badges>
                    <SubpageHero.Title className='text-center'>Volunteer for Iligan</SubpageHero.Title>
                    <SubpageHero.Description className='mx-auto text-center'>
                        Help us build a more tech-centric, informed, and connected City of Majestic Waterfalls. Everyone has a role to play.
                    </SubpageHero.Description>
                </SubpageHero>

                {/* Main Two-Column Layout */}
                <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* LEFT COLUMN: The Philosophy and Mission */}
                    <div className="lg:col-span-7 space-y-10">

                        <section className="space-y-4">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Get Involved, Stay Involved
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                BetterIligan's core mission is to advance civic technology and make local governance accessible. The engine that drives this mission comprises people like you who operate at the grass-roots level. Whether these activities pertain to writing code, gathering data, or educating the public, we owe everything to the hard work and dedication of our volunteers.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Today we have more ways than ever for you to get involved, ranging from technical contributions to community verification and historical documentation.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Take a hand in leading BetterIligan
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                It's hard to overemphasize the value of the contributions made by our community. This starts at the very foundation where volunteers dictate what features get built next, what data needs verifying, and how we present Iligan to the world. If you want to work with a passionate team to shape the digital future of our city, you can take a leadership role in our upcoming projects.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Lend expertise <br className='sm:hidden' /> in your chosen field
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                No matter where your expertise lies, there is a good chance that BetterIligan needs it. You do not need to be a programmer to contribute to a tech-centric city.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We are actively looking for <strong className="text-slate-900">government workers</strong> who understand the exact procedures of public services, <strong className="text-slate-900">history and culture professors</strong> to accurately document our city's heritage, and <strong className="text-slate-900">everyday citizens</strong> who know the jeepney routes, the local hotlines, and what information the common folk actually need.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Your involvement enables you to remain at your most creative, keep abreast of emerging civic tech trends, and take advantage of networking possibilities that can advance your own career while serving the city.
                            </p>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Actionable Steps */}
                    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 sticky top-24">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Ok, I'm ready — how do I get involved?
                        </h3>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                            Consider the activities below that present important and fulfilling opportunities for you to make your mark on Iligan City:
                        </p>

                        <ul className="space-y-6 mb-10">
                            <li className="flex gap-4">
                                <div className="mt-1 bg-blue-50 text-blue-600 p-2 rounded-lg h-fit">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Developers & Engineers</h4>
                                    <p className="text-sm text-slate-600 mt-1">Help us build open-source Next.js applications, manage databases, and create APIs for public data.</p>
                                </div>
                            </li>

                            <li className="flex gap-4">
                                <div className="mt-1 bg-fuchsia-50 text-fuchsia-600 p-2 rounded-lg h-fit">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Designers & UI/UX</h4>
                                    <p className="text-sm text-slate-600 mt-1">Craft accessible, beautiful interfaces that make finding government information intuitive for everyone.</p>
                                </div>
                            </li>

                            <li className="flex gap-4">
                                <div className="mt-1 bg-sky-50 text-sky-600 p-2 rounded-lg h-fit">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Social Media & Content</h4>
                                    <p className="text-sm text-slate-600 mt-1">Spread the word, write clear copy for our service guides, and manage our community outreach.</p>
                                </div>
                            </li>

                            <li className="flex gap-4">
                                <div className="mt-1 bg-amber-50 text-amber-600 p-2 rounded-lg h-fit">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Academics & Gov Workers</h4>
                                    <p className="text-sm text-slate-600 mt-1">Provide domain expertise. Help us accurately document Iligan's history, culture, and bureaucratic procedures.</p>
                                </div>
                            </li>

                            <li className="flex gap-4">
                                <div className="mt-1 bg-emerald-50 text-emerald-600 p-2 rounded-lg h-fit">
                                    <SearchCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Community Verifiers</h4>
                                    <p className="text-sm text-slate-600 mt-1">You don't need a specific title. Test our platform, report broken links, and tell us what the common folk need to see.</p>
                                </div>
                            </li>
                        </ul>

                        {/* MODAL TRIGGER MOVED TO CLIENT COMPONENT */}
                        <VolunteerModalClient />
                    </div>
                </div>

            </main>
        </>
    );
}
