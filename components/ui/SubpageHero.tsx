import React from 'react';
import Image from 'next/image';

interface SubpageHeroProps {
    children: React.ReactNode;
    bannerUrl?: string;
    logoUrl?: string;
}

// 1. The Main Wrapper
export default function SubpageHero({ children, bannerUrl, logoUrl }: SubpageHeroProps) {
    return (
        <header className="relative bg-white border-b border-slate-200 overflow-hidden">

            {/* Background Banner Layer */}
            {bannerUrl && (
                <>
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={bannerUrl}
                            alt="Background Banner"
                            fill
                            priority // Loads this immediately since it's above the fold!
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                    </div>
                    {/* The Readability Gradient */}
                    <div className="absolute inset-0 z-0 bg-white/90 md:bg-linear-to-r md:from-white md:via-white/50 md:to-white/30"></div>
                </>
            )}

            {/* Content Layer */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

                    {/* Logo Container */}
                    {logoUrl && (
                        <div className="relative w-20 h-20 md:w-32 md:h-32 shrink-0 bg-white rounded-2xl shadow-lg border border-slate-100 p-2 overflow-hidden">
                            <Image
                                src={logoUrl}
                                alt="Profile Logo"
                                fill
                                sizes="(max-width: 768px) 80px, 128px"
                                className="object-contain p-2"
                            />
                        </div>
                    )}

                    {/* The Text Content */}
                    <div className="flex-1">
                        {children}
                    </div>

                </div>
            </div>
        </header>
    );
}

// 2. The Badges Container
SubpageHero.Badges = function SubpageHeroBadges({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            {children}
        </div>
    );
};

// 3. The Title
SubpageHero.Title = function SubpageHeroTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {children}
        </h1>
    );
};

// 4. The Description
SubpageHero.Description = function SubpageHeroDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            {children}
        </p>
    );
};
