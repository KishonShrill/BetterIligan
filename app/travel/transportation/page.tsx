import { Metadata } from 'next';
import { ExternalLink, HardHat } from 'lucide-react';
import MapWrapper from './MapWrapper';
import SubpageHero from '@/components/ui/SubpageHero';


export const metadata: Metadata = {
    title: "Jeepney Routes",
    description: "Interactive map of Iligan City jeepney routes and transportation guides.",
};

export default function TransportationPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-semibold border border-amber-200">
                        <HardHat className="w-3.5 h-3.5" /> Page is Under Construction
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-semibold border border-amber-200">
                        <ExternalLink className="w-3.5 h-3.5" /> Community Info
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Transportation</SubpageHero.Title>
                <SubpageHero.Description>
                    Get the community gathered jeepney routes of Iligan City and never get lost while exploring.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
                {/* The heavy lifting happens inside this client component */}
                <MapWrapper />
            </div>
        </main>
    );
}
