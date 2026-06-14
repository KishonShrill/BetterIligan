import React from 'react';

// 1. The Main Wrapper
export default function SubpageHero({ children }: { children: React.ReactNode }) {
    return (
        <header className="bg-white border-b border-slate-200">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16">
                {children}
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
