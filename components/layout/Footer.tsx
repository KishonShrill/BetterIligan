"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Github } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

type ClassName = { className?: string; }

const footerSections: FooterSection[] = [
    {
        title: 'About',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Open Data', href: '/open-data' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' }
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'All Services', href: '/services' },
            { label: 'Disaster Preparedness', href: '/disaster' },
            { label: 'Business and Trade', href: '/services?category=Business%2C+Trade+and+Investment' },
            { label: 'Certificates and Vital Records', href: '/services?category=Certificates+and+Vital+Records' },
            { label: 'Health', href: '/services?category=Health+and+Wellness' },
        ],
    },
    {
        title: 'Government',
        links: [
            { label: 'City Officials', href: '/government' },
            { label: 'Departments', href: '/government/departments' },
            { label: 'Barangays', href: '/iligan/barangays' },
            { label: 'Transparency', href: '#' },
        ],
    },
    {
        title: 'Official',
        links: [
            { label: 'iligan.gov.ph', href: 'https://iligan.gov.ph/', external: true }
        ],
    }
];

export default function Footer({ className }: ClassName) {
    const pathname = usePathname();

    return (
        <footer className={`${className} ${(pathname === "/travel/transportation/map" || pathname === "/bangon-iligan") && "hidden"} bg-slate-900 text-white font-sans overflow-hidden`}>
            <div className="container mx-auto px-4 pt-16 pb-8 flex flex-col min-h-full">

                {/* Description & Socials nested right above the giant logo */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-6 md:mb-8">
                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                        Open-source civic tech initiative making government information
                        accessible for Iliganons.
                    </p>
                    <div className="flex gap-3 shrink-0">
                        <a
                            href="https://www.facebook.com/BetterIliganCity.org"
                            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a
                            href="https://github.com/KishonShrill/BetterIligan"
                            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* 1. TOP: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 md:mb-24">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold mb-4 text-slate-100">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) =>
                                    link.external ? (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-slate-400 hover:text-white text-sm transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ) : (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-400 hover:text-white text-sm transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 2. MIDDLE: Description, Socials, and Expanding Branding */}
                <div className="flex flex-col mt-auto border-b border-slate-800 pb-8 mb-8">

                    {/* The Dynamically Expanding Logo & Name */}
                    <div className="w-full flex items-center justify-center gap-3 sm:gap-6">
                        <Image
                            src="/images/logos/betteriligan-logo.png"
                            alt="BetterIliganCity Logo"
                            width={200}
                            height={200}
                            className="w-[12vw] max-w-[140px] min-w-[50px] h-auto rounded-xl sm:rounded-2xl object-cover shrink-0 select-none"
                        />
                        <div className="font-black text-[clamp(2rem,9vw,10rem)] leading-none tracking-tighter text-white select-none text-right truncate">
                            BetterIliganCity
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM: Copyright & Sitemap */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm text-center sm:text-left">
                            &copy; {new Date().getFullYear()} BetterIliganCity · Not an official
                            government website
                        </p>
                        <Link
                            href="/site-map"
                            className="text-slate-500 hover:text-white text-sm transition-colors shrink-0"
                        >
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
