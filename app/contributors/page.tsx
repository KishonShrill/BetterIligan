import { Metadata } from 'next';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { Users } from 'lucide-react';
import ContributorsClient from './ContributorsClient';

export const metadata: Metadata = {
    title: 'Contributors',
    description: 'Meet the developers, maintainers, and community volunteers building BetterIliganCity.',
};

export default function ContributorsPage() {
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

            <ContributorsClient />
        </main>
    );
}
