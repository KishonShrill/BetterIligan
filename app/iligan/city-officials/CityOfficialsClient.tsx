'use client'

import { Landmark, Gavel, User, Award, ShieldCheck } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

// Adjust the path to match where you saved your JSON
import officialsData from '@/data/iligan/city-officials.json';

export default function CityOfficialsClient() {
    const cityOfficialsReferences = [
        {
            title: "iligan.gov.ph - 18th Council",
            url: "https://iligan.gov.ph/knowiligan/18thcouncil?640614431"
        }
    ]
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100">
                        Local Government
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>City Officials</SubpageHero.Title>
                <SubpageHero.Description>
                    The elected leaders of Iligan City comprising the Executive and Legislative branches.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">

                {/* --- EXECUTIVE BRANCH --- */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive Branch</h2>
                            <p className="text-sm text-slate-500 font-medium">Office of the City Mayor</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {officialsData.executive.map((official, idx) => (
                            <div
                                key={idx}
                                className="relative bg-white border border-blue-100 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all overflow-hidden group"
                            >
                                {/* Decorative background accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10 flex items-start gap-5">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-1">
                                            {official.position}
                                        </p>
                                        <h3 className="text-2xl font-black text-slate-900">
                                            {official.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- LEGISLATIVE BRANCH --- */}
                <section>
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                            <Gavel className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Legislative Branch</h2>
                            <p className="text-sm text-slate-500 font-medium">Sangguniang Panlungsod (City Council)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {officialsData.legislative.map((official, idx) => {
                            // Check if it's the SK President to give them a slightly different icon/styling
                            const isSK = official.position.includes("SK");

                            return (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center gap-4 group"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSK ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                                        } transition-colors`}>
                                        {isSK ? <Award className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                                            {official.name}
                                        </h3>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                                            {official.position}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <ReferencesFooter references={cityOfficialsReferences} />

            </div>
        </main>
    );
}
