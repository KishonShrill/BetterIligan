import React from "react";
import Image from "next/image";

interface SubpageHeroProps {
  children: React.ReactNode;
  className?: string;
  bannerUrl?: string;
  logoUrl?: string;
}

// 1. The Main Wrapper
export default function SubpageHero({
  children,
  bannerUrl,
  className,
  logoUrl,
}: SubpageHeroProps) {
  return (
    <header
      className={`relative overflow-hidden border-b border-slate-200 bg-white ${className}`}
    >
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
      <div className="relative z-10 container mx-auto px-4 py-10 md:px-6 md:py-16">
        <div className="flex flex-col items-start gap-6 md:flex-row md:gap-10">
          {/* Logo Container */}
          {logoUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-lg md:h-32 md:w-32">
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
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </header>
  );
}

// 2. The Badges Container
SubpageHero.Badges = function SubpageHeroBadges({
  children,
  className,
}: SubpageHeroProps) {
  return (
    <div className={`${className} mb-4 flex flex-wrap items-center gap-3`}>
      {children}
    </div>
  );
};

// 3. The Title
SubpageHero.Title = function SubpageHeroTitle({
  children,
  className,
}: SubpageHeroProps) {
  return (
    <h1
      className={`mb-4 text-3xl font-extrabold tracking-tight md:text-5xl ${className} text-slate-900`}
    >
      {children}
    </h1>
  );
};

// 4. The Description
SubpageHero.Description = function SubpageHeroDescription({
  children,
  className,
}: SubpageHeroProps) {
  return (
    <p
      className={`max-w-3xl text-[13px] leading-relaxed sm:text-lg ${className} text-slate-600`}
    >
      {children}
    </p>
  );
};
