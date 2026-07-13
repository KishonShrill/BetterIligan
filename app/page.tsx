import { Metadata } from "next";
import { safeJsonLd } from '@/lib/utils';
import ActiveIncidentBanner from "@/sections/homepage/ActiveIncidentBanner";
import HeroSection from "@/sections/homepage/Hero";
import ServicesSection from "@/sections/homepage/Services";
import EmergencyHotlines from "@/sections/homepage/EmergencyHotlines";
import WeatherAndMap from "@/sections/homepage/WeatherMap";
import CityStatsSummary from "@/sections/homepage/CityStats";
import DonationSection from "@/sections/homepage/DonationSection";

export const metadata: Metadata = {
    title: { absolute: "BetterIligan City | Civic Tech Portal" }
}

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BetterIligan",
        "alternateName": ["BetterIligan City", "Better Iligan City"],
        "url": "https://betteriligancity.org/"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
            />

            <ActiveIncidentBanner />
            <HeroSection />
            <DonationSection />
            <ServicesSection />
            <EmergencyHotlines />
            <CityStatsSummary />
            <WeatherAndMap />
        </>
    );
}
