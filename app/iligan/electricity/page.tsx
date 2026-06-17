import { Metadata } from 'next';
import ElectricityClient from './ElectricityClient';

export const metadata: Metadata = {
    title: 'Electricity & Utilities',
    description: 'Information about electricity management, providers, and resources in Iligan City.',
    openGraph: {
        title: 'Iligan City Electricity Information',
        description: 'Learn about Iligan City\'s electricity providers, management, and use our utility calculator.',
        url: 'https://betteriligancity.org/iligan/electricity',
        type: 'website',
    },
};

export default function ElectricityPage() {
    return (
        <ElectricityClient />
    );
}
