'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ShieldCheck, Heart, User, Loader2 } from 'lucide-react';
import communityVolunteers from '@/data/community-volunteers.json';

interface GitHubContributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
    type: string;
}

interface CommunityVolunteer {
    name: string;
    profession: string;
    profile_pic?: string;
}

export default function ContributorsClient() {
    const [contributors, setContributors] = useState<GitHubContributor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const res = await fetch('https://api.github.com/repos/KishonShrill/BetterIligan/contributors', {
                    headers: {
                        'User-Agent': 'BetterIligan-Contributors-Page',
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch GitHub contributors");

                const data = await res.json();

                // Defensive check in case GitHub rate-limits the user's IP
                if (Array.isArray(data)) {
                    setContributors(data);
                }
            } catch (error) {
                console.error("Error fetching contributors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributors();
    }, []);

    const owner = contributors.find(c => c.login === 'KishonShrill');
    const maintainers = contributors.filter(c => c.login !== 'KishonShrill' && c.type === 'User');
    const volunteers = communityVolunteers as CommunityVolunteer[];

    return (
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-12 space-y-16">

            {/* --- LOADING STATE --- */}
            {isLoading && (
                <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="font-medium animate-pulse">Loading GitHub contributors...</p>
                </div>
            )}

            {/* --- SECTION 1: THE OWNER/LEAD --- */}
            {!isLoading && owner && (
                <section className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-2xl font-bold text-slate-900">Project Lead</h2>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl">
                        <Image
                            src={`${owner.avatar_url}&s=128`}
                            alt={owner.login}
                            width={128}
                            height={128}
                            unoptimized
                            priority
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 shadow-md"
                        />
                        <div className="text-center sm:text-left flex-1">
                            <h3 className="text-2xl font-bold text-slate-900">{owner.login}</h3>
                            <p className="text-slate-500 font-medium mb-4">Founder & Lead Developer</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                    {owner.contributions} Contribution{owner.contributions !== 1 ? 's' : ''}
                                </span>
                                <a
                                    href={owner.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-blue-600 px-4 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                    <Github className="w-4 h-4" />
                                    GitHub Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION 2: GITHUB MAINTAINERS --- */}
            {!isLoading && (
                <section className="space-y-6 animate-in fade-in duration-500 delay-100">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                        <Github className="w-6 h-6 text-slate-700" />
                        <h2 className="text-2xl font-bold text-slate-900">Code Contributors</h2>
                    </div>

                    {maintainers.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {maintainers.map((contributor) => (
                                <a
                                    key={contributor.id}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-5 flex flex-col items-center text-center transition-all group"
                                >
                                    <Github className="w-4 h-4 text-slate-300 group-hover:text-blue-500 absolute top-4 right-4 transition-colors" />
                                    <Image
                                        src={`${contributor.avatar_url}&s=128`}
                                        alt={contributor.login}
                                        width={128}
                                        height={128}
                                        unoptimized
                                        className="w-18 h-18 rounded-full mb-3 shadow-sm group-hover:ring-2 group-hover:ring-blue-100 transition-all"
                                    />
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {contributor.login}
                                    </h3>
                                    <span className="mt-2 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                                        {contributor.contributions} Contribution{contributor.contributions !== 1 ? 's' : ''}
                                    </span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
                                <Github className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No contributors to show right now</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                We couldn&apos;t load the contributor list from GitHub. Check back shortly, or view the project directly on GitHub.
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* --- SECTION 3: COMMUNITY VOLUNTEERS (STATIC JSON) --- */}
            {/* Renders instantly, independent of GitHub loading */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-rose-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Community Volunteers</h2>
                    </div>
                    <Link href="/volunteer" className="hidden sm:block text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Become a volunteer &rarr;
                    </Link>
                </div>

                {volunteers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {volunteers.map((volunteer, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                                {volunteer.profile_pic ? (
                                    <Image
                                        src={volunteer.profile_pic}
                                        alt={volunteer.name}
                                        width={56}
                                        height={56}
                                        unoptimized // Good practice for external links to save CPU
                                        className="w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100 shrink-0"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 line-clamp-1">{volunteer.name}</h3>
                                    <span className="inline-block mt-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider line-clamp-1">
                                        {volunteer.profession}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Be the first to join!</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            We currently have no public community volunteers listed. Whether you are a government worker, teacher, or everyday citizen, we need your help.
                        </p>
                        <Link
                            href="/volunteer"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                        >
                            Join as a Volunteer
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
