import { Bus, CalendarClock, MapPin, Phone, Users, BusFront, HardHat } from 'lucide-react';
import SubpageHero from '@/components/ui/SubpageHero';

export default function TransportationCharters() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <SubpageHero>
                <SubpageHero.Badges>
                    <div className='mx-auto flex gap-4'>
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-semibold border border-amber-200">
                            <HardHat className="w-3.5 h-3.5" /> Page is Under Construction
                        </span>
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-100 flex items-center gap-1.5 w-fit">
                            <BusFront className="w-3.5 h-3.5" />
                            Transport Guide
                        </span>
                    </div>
                </SubpageHero.Badges>
                <SubpageHero.Title className='text-center'>Transportation</SubpageHero.Title>
            </SubpageHero>

            <section className="container mt-16 mx-auto">
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Charters & Vehicle Rentals</h2>
                    <p className="text-slate-500 mt-1">Private transport options for group events, outings, and company trips.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* MITSCO Mini Bus Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Bus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">MITSCO Mini Bus</h3>
                                    <p className="text-xs font-semibold text-slate-500">Metro Iligan Transport Service Cooperative</p>
                                </div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                Co-op Managed
                            </span>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <span>Serving Iligan City and nearby areas</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <span>Ideal for Outings, Events, Company Trips & Family Travel</span>
                            </div>

                            {/* Highlighted Rule */}
                            <div className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100 mt-2">
                                <CalendarClock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span className="font-medium">Advance booking required at least 3 days before departure.</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact to Book</p>
                            <div className="flex flex-wrap gap-2">
                                <a href="tel:+639942269218" className="inline-flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                                    <Phone className="w-3.5 h-3.5" />
                                    +63 994 226 9218
                                </a>
                                <a href="tel:369924898199" className="inline-flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                                    <Phone className="w-3.5 h-3.5" />
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
