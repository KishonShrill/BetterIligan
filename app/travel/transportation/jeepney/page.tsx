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
            {/* The heavy lifting happens inside this client component */}
            <MapWrapper />
        </main>
    );
}
