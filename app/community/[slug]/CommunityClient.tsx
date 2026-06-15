'use client'

import {
    Globe, Facebook, Instagram, Phone,
    MessageCircle, User, Briefcase, ExternalLink, ShieldCheck, CheckCircle2
} from 'lucide-react';

import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';

import { serviceCategories } from '@/data/categories';
import { AllService } from '@/validations/serviceSchema';

interface CommunityClientProps {
    community: AllService;
}

export default function CommunityClient({ community }: CommunityClientProps) {

    const categoryData = serviceCategories.find(
        (c) => c.name === community?.category || c.slug === community?.category
    );

    const CategoryIcon = categoryData?.icon || Briefcase;

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-20">

            {/* Top Navigation Bar */}
            <SubpageNav />

            {/* Hero Section */}
            <SubpageHero
                bannerUrl={community.type === 'internal' ? community.bannerUrl : undefined}
                logoUrl={community.type === 'internal' ? community.logoUrl : undefined}
            >
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-100">
                        Community Profile
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-200">
                        <CategoryIcon className="w-3.5 h-3.5 text-slate-500" />
                        {community.category}
                    </span>

                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                    </span>
                </SubpageHero.Badges>

                <SubpageHero.Title>
                    {community.title}
                </SubpageHero.Title>

                <SubpageHero.Description>
                    {community.description}
                </SubpageHero.Description>
            </SubpageHero>

            {/* Main Content Area */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Content */}
                <div className="lg:col-span-8">

                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                            Programs & Services
                        </h3>

                        {community.type === "internal" && community.offeredServices && community.offeredServices.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {community.offeredServices.map((serviceName, idx) => (
                                    <li key={idx} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-semibold text-slate-800 capitalize leading-relaxed">
                                            {serviceName.replace(/-/g, ' ')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-10 border border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center text-center">
                                <Briefcase className="w-8 h-8 text-slate-300 mb-3" />
                                <p className="text-slate-500 text-sm font-medium max-w-sm">
                                    No specific programs have been listed for this partner yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Quick Facts Sidebar */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Official Channels Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Official Channels</h3>
                        <div className="flex flex-col gap-3">
                            {community.type === "internal" && community.websiteUrl && (
                                <a href={community.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Website</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </a>
                            )}

                            {community.type === "internal" && community.facebookUrl && (
                                <a href={community.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Facebook className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Facebook Page</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </a>
                            )}

                            {community.type === "internal" && community.instagramUrl && (
                                <a href={community.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Instagram className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-pink-700 transition-colors">Instagram</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
                                </a>
                            )}

                            {community.type === "internal" && !community.websiteUrl && !community.facebookUrl && !community.instagramUrl && (
                                <p className="text-xs text-slate-500 italic px-2">No external links available.</p>
                            )}
                        </div>
                    </div>

                    {/* Point of Contact Card */}
                    {community.type === "internal" && community.representative && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Point of Contact</h3>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold border border-slate-200 shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{community.representative.name}</p>
                                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Representative</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                                {community.representative.contactNumber && (
                                    <div className="flex items-center gap-3 text-sm text-slate-700 p-2">
                                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="font-medium">{community.representative.contactNumber}</span>
                                    </div>
                                )}

                                {community.representative.messengerUrl && (
                                    <a href={community.representative.messengerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors font-semibold group">
                                        <MessageCircle className="w-4 h-4 shrink-0 text-blue-500 group-hover:text-blue-600" />
                                        Message on Messenger
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}
