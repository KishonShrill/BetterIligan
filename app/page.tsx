import HeroSection from "@/sections/homepage/Hero";
import ServicesSection from "@/sections/homepage/Services";
import WeatherAndMap from "@/sections/homepage/WeatherMap";
import CityStatsSummary from "@/sections/homepage/CityStats";

export default function Home() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <CityStatsSummary />
            <WeatherAndMap />
        </>
    );
}
