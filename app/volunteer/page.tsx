import { Metadata } from 'next';
import VolunteerClient from './VolunteerClient';

export const metadata: Metadata = {
    title: 'Volunteer | BetterIliganCity',
    description: 'Join our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible.',
    openGraph: {
        title: 'Volunteer | BetterIliganCity',
        description: 'Join our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible. Developers, designers, and citizens welcome.',
        url: 'https://betteriligancity.org/volunteer',
        type: 'website',
    }
};

export default function VolunteerPage() {
    // JSON-LD to establish BetterIliganCity as a civic organization 
    // and explicitly link it to the national BetterGov Philippines initiative.
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Volunteer for BetterIliganCity",
        "description": "Information on how to volunteer, contribute code, or verify data for the BetterIliganCity civic tech project.",
        "url": "https://betteriligancity.org/volunteer",
        "about": {
            "@type": "NGO",
            "name": "BetterIliganCity",
            "description": "A volunteer-led civic tech initiative building digital public goods for Iligan City.",
            "location": {
                "@type": "Place",
                "name": "Iligan City, Northern Mindanao, Philippines"
            },
            "parentOrganization": {
                "@type": "NGO",
                "name": "BetterGov Philippines",
                "url": "https://bettergov.ph/"
            }
        },
        "potentialAction": {
            "@type": "JoinAction",
            "name": "Join BetterIliganCity Community",
            "target": "https://discord.gg/bettergovph"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <VolunteerClient />
        </>
    );
}
