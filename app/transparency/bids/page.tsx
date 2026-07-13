import { Metadata } from 'next';
import BidsClient from './BidsClient';

export const metadata: Metadata = {
    title: 'Bids & Procurement',
    description: 'Track open, awarded, and in-progress procurement projects from the City Government of Iligan, with direct links to bid documents.',
};

export default function BidsPage() {
    return <BidsClient />;
}
