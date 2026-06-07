import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ArrowUpRight, FileText, Landmark } from 'lucide-react';
import Section from '@/components/ui/Section';

export default function HeroSection() {
    return (
        <Section className='bg-blue-600 min-h-125'>
            {/* Subtle Background Grid for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative max-w-404 mx-auto px-6 lg:px-8 py-4 md:py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

                {/* Status Badge */}
                <div className="max-lg:hidden col-span-1 lg:col-span-2 w-fit mx-auto lg:mx-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Citizen Portal Active
                </div>

                {/* Left Column - Fixed max-width and added responsive centering */}
                <div className="max-w-404 mx-auto lg:mx-0 text-center lg:text-left">
                    <h1 className="max-lg:text-left text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                        Welcome to <br /> BetterIligan City
                    </h1>

                    <p className="max-lg:max-w-lg max-lg:text-left text-blue-100 text-lg mb-8 leading-relaxed">
                        A modernized, volunteer-driven portal to access government services, public data, and resources for the people of Iligan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <Link
                            href='/services'
                            className="group flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-lg transition-all duration-200"
                        >
                            Browse Services
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-transparent border border-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500/50 transition-all duration-200">
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* Right Column - Elevated Search Card */}
                <div className="w-full max-lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Search className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Find a Service</h2>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-6 group">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="e.g., birth certificate, business permit"
                                className="w-full pl-12 pr-12 py-3.5 md:py-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-200"
                            />
                            <button
                                type="button"
                                aria-label="Search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Popular Searches */}
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Popular Searches
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Birth Certificate', icon: FileText },
                                    { name: 'Business Permit', icon: Landmark },
                                    { name: 'Real Property Tax', icon: FileText },
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-sm px-3.5 py-2 rounded-full transition-colors"
                                    >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
}
