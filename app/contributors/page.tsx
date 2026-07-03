import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { Github, Users, ShieldCheck, Heart, User } from 'lucide-react';

// Import the static community volunteers
import communityVolunteers from '@/data/community-volunteers.json';

export const metadata: Metadata = {
    title: 'Contributors | BetterIliganCity',
    description: 'Meet the developers, maintainers, and community volunteers building BetterIliganCity.',
};

// Define the shape of the GitHub API response
interface GitHubContributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
    type: string;
}

// Define your static volunteer type
interface CommunityVolunteer {
    name: string;
    profession: string;
    profile_pic?: string;
}

// 1. CACHED FETCH FUNCTION
async function getGithubContributors(): Promise<GitHubContributor[]> {
    try {
        // We use your exact repo path. 
        // 'next: { revalidate: 3600 }' caches this fetch for 1 hour (3600 seconds)!
        const res = await fetch('https://api.github.com/repos/KishonShrill/BetterIligan/contributors', {
            next: { revalidate: 3600 },
            headers: {
                'User-Agent': 'BetterIligan-Contributors-Page',
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch GitHub contributors");
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching contributors:", error);
        return [];
    }
}

export default async function ContributorsPage() {
    const allContributors = await getGithubContributors();

    // 2. SEPARATE OWNER FROM CONTRIBUTORS
    // Filter you out specifically using your GitHub handle
    const owner = allContributors.find(c => c.login === 'KishonShrill');
    const maintainers = allContributors.filter(c => c.login !== 'KishonShrill' && c.type === 'User');

    // Type casting the imported JSON
    const volunteers = communityVolunteers as CommunityVolunteer[];

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <SubpageNav href="/" text="Back to Home" />

            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100 flex items-center gap-1.5 w-fit mx-auto">
                        <Users className="w-3.5 h-3.5" />
                        Our Team
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title className='text-center'>The People Behind BetterIligan</SubpageHero.Title>
                <SubpageHero.Description className='mx-auto text-center'>
                    Meet the developers, maintainers, and everyday citizens working together to build a better digital infrastructure for our city.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-12 space-y-16">

                {/* --- SECTION 1: THE OWNER/LEAD --- */}
                {owner && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold text-slate-900">Project Lead</h2>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl">
                            <Image
                                src={owner.avatar_url}
                                alt={owner.login}
                                width={128}
                                height={128}
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
                <section className="space-y-6">
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
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        width={128}
                                        height={128}
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
                                We couldn&apos;t load the contributor list from GitHub. Check back shortly, or view the
                                project directly on GitHub.
                            </p>
                        </div>
                    )}
                </section>

                {/* --- SECTION 3: COMMUNITY VOLUNTEERS (STATIC JSON) --- */}
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
                        /* FALLBACK UI FOR EMPTY VOLUNTEERS */
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
        </main>
    );
}
