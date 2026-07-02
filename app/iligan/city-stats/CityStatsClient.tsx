'use client'

import { useState } from 'react';
import Link from 'next/link';
import {
    Building2, MapPin, CalendarDays, Users, Banknote, Landmark,
    Calendar, PieChart, Mountain, GraduationCap, Stethoscope,
    Zap, Anchor, Wifi, Info
} from 'lucide-react';
import Section from '@/components/ui/Section';
import SubpageHero from '@/components/ui/SubpageHero';
import ReferencesFooter from '@/components/ui/ReferencesFooter';

import { CityProfileSchema, CityProfileData } from '@/validations/cityProfileSchema';
import rawCityData from '@/data/iligan/city-profile.json';

const cityData: CityProfileData = CityProfileSchema.parse(rawCityData);

type Tab = 'all' | 'demographics' | 'government' | 'economy' | 'environment' | 'infrastructure';

export default function CityStatsFullPage() {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const cityStatsReferences = [
        {
            title: "Philippine Statistics Authority 2024 POPCEN · PSA City GDP 2022 · Iligan City Government official records",
            url: "https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president"
        }
    ]

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <h2 className="sr-only">Iligan City official profile — demographics, government, economy, environment, and infrastructure.</h2>

            {/* --- HERO SECTION --- */}
            <SubpageHero
                className="bg-linear-to-r from-primary-700 to-primary-600 rounded-b-3xl"
                logoUrl={"/images/logos/city-legal-office-(clo).png"}
            >
                <SubpageHero.Badges>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#185FA5] text-[#85B7EB] bg-[#0C447C]">
                        <Building2 className="w-3 h-3" /> {cityData.header.classification}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#185FA5] text-[#85B7EB] bg-[#0C447C]">
                        <MapPin className="w-3 h-3" /> {cityData.header.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#185FA5] text-[#85B7EB] bg-[#0C447C]">
                        <CalendarDays className="w-3 h-3" /> {cityData.header.foundedBadge}
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title className='text-white'>{cityData.header.name}</SubpageHero.Title>
                <SubpageHero.Description className='text-[#85B7EB]'>
                    {cityData.header.description} <span className="text-[#B5D4F4] font-medium">{cityData.header.highlight}</span>{cityData.header.descriptionEnd}
                </SubpageHero.Description>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-0 mt-5 pt-5 border-t border-[#185FA5]">
                    {cityData.quickStats.map((stat, idx) => (
                        <div key={idx} className="py-2.5 px-2">
                            <div className="text-[10px] uppercase tracking-wider text-[#378ADD] font-medium mb-0.5">{stat.label}</div>
                            <div className="text-[14px] font-medium text-white leading-snug">{stat.value}</div>
                            <div className="text-[10px] text-[#85B7EB] mt-px">{stat.subtext}</div>
                        </div>
                    ))}
                </div>
            </SubpageHero>

            {/* --- TABS --- */}
            <Section className='max-sm:pt-0 max-sm:pb-8'>
                <div className="flex gap-1 my-5 overflow-x-auto scrollbar-none touch-pan-x" role="tablist">
                    {(['all', 'demographics', 'government', 'economy', 'environment', 'infrastructure'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            role="tab"
                            className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border border-[#B5D4F4] whitespace-nowrap transition-all duration-150 ${activeTab === tab
                                ? 'bg-[#042C53] text-white border-[#042C53]'
                                : 'bg-transparent text-[#0C447C] hover:bg-[#E6F1FB]'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* --- SECTIONS --- */}
                <div className="flex flex-col gap-4">

                    {/* TAB: ALL */}
                    {activeTab === 'all' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                    <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-[#378ADD]" /> Population
                                    </div>
                                    <div className="text-[22px] font-bold text-slate-900 leading-tight">368,132</div>
                                    <div className="text-[11px] text-slate-500 mt-1">2024 Census · 87,239 households</div>
                                    <hr className="border-t border-[#E6F1FB] my-3" />
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Density</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">452.60 / km²</span></div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Growth rate</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">+0.33% / year</span></div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Barangays</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">44</span></div>
                                    <div className="flex justify-between items-center py-1.5"><span className="text-[13px] text-slate-500">Language</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">Cebuano</span></div>
                                </div>
                                <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                    <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                        <Banknote className="w-3.5 h-3.5 text-[#378ADD]" /> Economy
                                    </div>
                                    <div className="text-[22px] font-bold text-slate-900 leading-tight">₱77.02B</div>
                                    <div className="text-[11px] text-slate-500 mt-1">GDP 2022 · equivalent $1.36B USD</div>
                                    <hr className="border-t border-[#E6F1FB] my-3" />
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Revenue (2024)</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">₱3,031M</span></div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Assets (2024)</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">₱13,377M</span></div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-[#E6F1FB]"><span className="text-[13px] text-slate-500">Income class</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">1st city</span></div>
                                    <div className="flex justify-between items-center py-1.5"><span className="text-[13px] text-slate-500">Poverty rate</span><span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">11.8% (2021)</span></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">23</div><div className="text-[12px] text-[#185FA5] mt-1.5">Waterfalls</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">8</div><div className="text-[12px] text-[#185FA5] mt-1.5">Natural springs</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">15</div><div className="text-[12px] text-[#185FA5] mt-1.5">Tourist caves</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">181</div><div className="text-[12px] text-[#185FA5] mt-1.5">Schools</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">54</div><div className="text-[12px] text-[#185FA5] mt-1.5">Health facilities</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">11</div><div className="text-[12px] text-[#185FA5] mt-1.5">Major industries</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">12</div><div className="text-[12px] text-[#185FA5] mt-1.5">Seaports</div></div>
                                <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-2xl p-4 text-center"><div className="text-[30px] font-bold text-[#042C53] leading-none">24</div><div className="text-[12px] text-[#185FA5] mt-1.5">Banks</div></div>
                            </div>
                        </>
                    )}

                    {/* TAB: DEMOGRAPHICS */}
                    {activeTab === 'demographics' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {cityData.demographics.grid.map((stat, idx) => (
                                    <div key={idx} className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                        <div className="text-[11px] text-[#185FA5] font-medium mb-0.5">{stat.label}</div>
                                        <div className="text-[22px] font-bold text-slate-900 leading-tight">{stat.value}</div>
                                        <div className="text-[11px] text-slate-500 mt-1">{stat.subtext}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5 text-[#378ADD]" /> General info
                                </div>
                                {cityData.demographics.generalInfo.map((row, idx) => (
                                    <div key={idx} className={`flex justify-between items-center py-1.5 ${idx !== cityData.demographics.generalInfo.length - 1 ? 'border-b border-[#E6F1FB]' : ''}`}>
                                        <span className="text-[13px] text-slate-500">{row.key}</span>
                                        <span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* TAB: GOVERNMENT */}
                    {activeTab === 'government' && (
                        <>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <Landmark className="w-3.5 h-3.5 text-[#378ADD]" /> Local government
                                </div>
                                {cityData.government.local.map((row, idx) => (
                                    <div key={idx} className={`flex justify-between items-center py-1.5 ${idx !== cityData.government.local.length - 1 ? 'border-b border-[#E6F1FB]' : ''}`}>
                                        <span className="text-[13px] text-slate-500">{row.key}</span>
                                        <span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#378ADD]" /> History & classification
                                </div>
                                {cityData.government.history.map((row, idx) => (
                                    <div key={idx} className={`flex justify-between items-center py-1.5 ${idx !== cityData.government.history.length - 1 ? 'border-b border-[#E6F1FB]' : ''}`}>
                                        <span className="text-[13px] text-slate-500">{row.key}</span>
                                        <span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* TAB: ECONOMY */}
                    {activeTab === 'economy' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {cityData.economy.grid.map((stat, idx) => (
                                    <Link key={idx} href={stat.href ? stat.href : "#"} className={`block bg-white border border-[#B5D4F4] ${stat.href ? "cursor-pointer hover:border-[#185FA5] transition-colors" : "cursor-default"} rounded-2xl p-4 md:p-5`}>
                                        <div className="text-[11px] text-[#185FA5] font-medium mb-0.5">{stat.label}</div>
                                        <div className="text-[22px] font-bold text-slate-900 leading-tight">{stat.value}</div>
                                        {stat.subtext && <div className="text-[11px] text-slate-500 mt-1">{stat.subtext}</div>}
                                    </Link>
                                ))}
                            </div>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <PieChart className="w-3.5 h-3.5 text-[#378ADD]" /> Commerce & services
                                </div>
                                {cityData.economy.commerce.map((row, idx) => (
                                    <div key={idx} className={`flex justify-between items-center py-1.5 ${idx !== cityData.economy.commerce.length - 1 ? 'border-b border-[#E6F1FB]' : ''}`}>
                                        <span className="text-[13px] text-slate-500">{row.key}</span>
                                        <span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* TAB: ENVIRONMENT */}
                    {activeTab === 'environment' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                {cityData.environment.wonders.map((wonder, idx) => (
                                    <div key={idx} className={`${wonder.bgColor} border ${wonder.borderColor} rounded-2xl p-4 text-center`}>
                                        <div className={`text-[30px] font-medium ${wonder.divColor} leading-none`}>{wonder.count}</div>
                                        <div className={`text-[12px] ${wonder.textColor} mt-1.5`}>{wonder.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <Mountain className="w-3.5 h-3.5 text-[#378ADD]" /> Geography & climate
                                </div>
                                {cityData.environment.geography.map((row, idx) => (
                                    <div key={idx} className={`flex justify-between items-center py-1.5 ${idx !== cityData.environment.geography.length - 1 ? 'border-b border-[#E6F1FB]' : ''}`}>
                                        <span className="text-[13px] text-slate-500">{row.key}</span>
                                        <span className="text-[13px] font-medium text-[#0C447C] text-right max-w-[55%]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* TAB: INFRASTRUCTURE */}
                    {activeTab === 'infrastructure' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {cityData.infrastructure.facilities.map((infra, idx) => {
                                    const IconComp =
                                        infra.icon === 'GraduationCap' ? GraduationCap :
                                            infra.icon === 'Stethoscope' ? Stethoscope :
                                                infra.icon === 'Zap' ? Zap : Anchor;

                                    return (
                                        <Link href={infra.href ? infra.href : "#"} key={idx} className={`cursor-default bg-white border border-[#B5D4F4] ${infra.href && "cursor-pointer group hover:bg-[#185FA5] hover:border-[#185FA5] transition-colors duration-100"} rounded-2xl p-4 flex items-start gap-3`}>
                                            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#E6F1FB] text-[#185FA5] shrink-0">
                                                <IconComp className="w-[18px] h-[18px]" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] group-hover:text-white text-[#185FA5] font-medium mb-0.5">{infra.label}</div>
                                                <div className="text-[20px] group-hover:text-white font-bold text-slate-900 my-0.5">{infra.value}</div>
                                                <div className="text-[11px] group-hover:text-white text-slate-500">{infra.subtext}</div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className="bg-white border border-[#B5D4F4] rounded-2xl p-4 md:p-5">
                                <div className="text-[11px] font-medium uppercase tracking-wider text-[#185FA5] mb-3.5 flex items-center gap-1.5">
                                    <Wifi className="w-3.5 h-3.5 text-[#378ADD]" /> Communications
                                </div>
                                <div className="flex flex-col gap-[9px]">
                                    {cityData.infrastructure.communications.map((comm, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5">
                                            <div className="w-[5px] h-[5px] rounded-full bg-[#378ADD] shrink-0 mt-1.5"></div>
                                            <div className="text-[13px] text-slate-900" dangerouslySetInnerHTML={{ __html: comm.replace(/(\d+[^ ]*)/, '<strong>$1</strong>') }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <ReferencesFooter references={cityStatsReferences} />

            </Section>
        </main>
    );
}
