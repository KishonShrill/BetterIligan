import HeroSection from "@/sections/homepage/Hero";
import ServicesSection from "@/sections/homepage/Services";
import WeatherAndMap from "@/sections/homepage/WeatherMap";
import CityStatsSummary from "@/sections/homepage/CityStats";

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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <HeroSection />
            <ServicesSection />
            <CityStatsSummary />
            <WeatherAndMap />
        </>
    );
}
