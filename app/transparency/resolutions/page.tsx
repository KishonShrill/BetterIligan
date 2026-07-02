import { Metadata } from 'next';
import ResolutionsClient from './ResolutionsClient';

export const metadata: Metadata = {
    title: 'City Resolutions & Ordinances',
    description: 'Browse resolutions and ordinances passed by the Sangguniang Panlungsod of Iligan City, with links to the official documents.',
    openGraph: {
        title: 'Iligan City Resolutions & Ordinances',
        description: 'Browse resolutions and ordinances passed by the Sangguniang Panlungsod of Iligan City.',
        url: 'https://betteriligancity.org/transparency/resolutions',
        type: 'website',
    },
};

export default function ResolutionsPage() {
    return <ResolutionsClient />;
}
