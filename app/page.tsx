import HeroSection from "@/sections/homepage/Hero";
import ServicesSection from "@/sections/homepage/Services";
import WeatherAndMap from "@/sections/homepage/WeatherMap";

export default function Home() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <WeatherAndMap />
        </>
    );
}
