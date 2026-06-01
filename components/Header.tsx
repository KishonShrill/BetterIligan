'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Globe, Rocket } from 'lucide-react';

const navigation = [
    {
        name: 'Iligan City',
        href: '/iligan',
        dropdown: [
            { name: 'All About Iligan', href: '/iligan' },
            { name: 'History & Heritage', href: '/iligan/history' },
            { name: 'Barangays', href: '/iligan/barangays' },
        ],
    },
    {
        name: 'Services',
        href: '/services',
        dropdown: [
            { name: 'All Services', href: '/services' },
            { name: 'Business and Trade', href: '/services/business' },
            { name: 'Certificates and IDs', href: '/services/certificates' },
            { name: 'Disaster and Weather', href: '/services/disaster' },
            { name: 'Health', href: '/services/health' },
        ],
    },
    {
        name: 'Travel',
        href: '/travel',
        dropdown: [
            { name: 'Explore Travel', href: '/travel' },
            { name: 'Waterfalls', href: '/travel/waterfalls' },
            { name: 'Accommodations', href: '/travel/accommodations' },
        ],
    },
    {
        name: 'Government',
        href: '/government',
        dropdown: [
            { name: 'Government Overview', href: '/government' },
            { name: 'City Officials', href: '/government/officials' },
            { name: 'Departments', href: '/government/departments' },
        ],
    },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const pathname = usePathname();

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const toggleAccordion = (name: string | null) => {
        setActiveAccordion(activeAccordion === name ? null : name);
    };

    return (
        <>
            <header className="font-sans sticky top-0 z-40 w-full bg-white border-b border-slate-200">
                <div className="max-w-350 mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo area */}
                        <div className="shrink-0 flex items-center gap-3">
                            {/* TODO: Replace with actual logo image later */}
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                BI
                            </div>
                            <div className="block leading-[0.25]">
                                <Link href="/" className="text-xl font-bold text-slate-900 leading-tight block">
                                    BetterIliganCity
                                </Link>
                                <span className="text-xs text-slate-500">A community-run portal for Iliganons</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8 h-fit">
                            {navigation.map((item) => (
                                <div key={item.name} className="relative group h-full flex items-center">
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
                                    >
                                        {/* Wrapped the text in a relative container for the underline anchor */}
                                        <span className="relative py-1">
                                            {item.name}
                                            {/* The Animated Center Underline Line */}
                                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                                    </Link>

                                    {/* Desktop Dropdown - Appears on hover (Unchanged, so it won't have the underline) */}
                                    <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0">
                                        <ul className="py-2">
                                            {item.dropdown.map((subItem, idx) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`block px-5 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 ${idx === 0 ? 'lg:hidden font-semibold border-b border-slate-100 mb-1' : ''}`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Right side actions (Search & Mobile Toggle) */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
                                <Search className="w-5 h-5" />
                                Search
                            </button>

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* TODO: Info Bar (Dark Blue strip like the reference)
                <div className="bg-[#1a2b4c] text-white py-1.5 px-4 hidden md:block">
                    <div className="max-w-[1400px] mx-auto flex justify-end gap-6 text-xs font-medium tracking-wide">
                        <span>₱ PHP 58.40</span>
                        <span className="opacity-50">|</span>
                        <span>ILIGAN 31°C</span>
                        <span>CDO 32°C</span>
                        <span>MARAWI 24°C</span>
                        <span>MANILA 33°C</span>
                    </div>
                </div>
                */}
            </header>

            {/* 
                MOBILE MENU OVERLAY
                Fixed positioning covers the screen, z-50 ensures it's above everything.
            */}
            {isMobileMenuOpen && (
                <>
                    {/* Mobile Dropdown Wrapper - Anchored exactly below the 80px header */}
                    <div className="fixed top-20 left-0 w-full z-40 bg-white border-t border-t-gray-100 shadow-xl flex flex-col lg:hidden animate-in slide-in-from-top-2 fade-in duration-200 max-h-[calc(100vh-80px)]">

                        {/* Mobile Navigation Links - Scrollable area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
                            {navigation.map((item) => (
                                <div key={item.name} className="border-b border-slate-100 last:border-0">
                                    <button
                                        onClick={() => toggleAccordion(item.name)}
                                        className="w-full flex items-center justify-between py-2 text-left text-lg font-medium text-slate-800"
                                    >
                                        {item.name}
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${activeAccordion === item.name ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Mobile Dropdown (Accordion Content) */}
                                    {activeAccordion === item.name && (
                                        <ul className="p-4 border-l-2 border-blue-100 bg-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                                            {item.dropdown.map((subItem, idx) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`pl-4 py-2 hover:bg-gray-200 hover:text-blue-600 block text-base ${idx === 0 ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                            {/* TODO: (still deciding to add or not) Static Mobile Links 
                            <div className="hidden pt-6 mt-2 border-t border-slate-200 flex flex-col gap-6">
                                <Link href="/join" className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                                    <Rocket className="w-5 h-5" /> Join Us
                                </Link>
                                <Link href="/about" className="text-lg font-medium text-slate-800">About</Link>
                                <Link href="/contact" className="text-lg font-medium text-slate-800">Contact Us</Link>
                                <button className="flex items-center gap-2 text-lg font-medium text-slate-800 w-fit">
                                    <Search className="w-5 h-5" /> Search
                                </button>

                                <div className="flex items-center gap-2 mt-4 pt-6 pb-4 border-t border-slate-200">
                                    <Globe className="w-5 h-5 text-slate-500" />
                                    <select className="bg-transparent text-slate-700 text-base font-medium focus:outline-none cursor-pointer">
                                        <option>English</option>
                                        <option>Cebuano</option>
                                        <option>Tagalog</option>
                                    </select>
                                </div>
                            </div>
                            */}
                        </div>

                        {/* Mobile Bottom Info Bar - Pinned at the bottom of the dropdown */}
                        <div className="shrink-0 bg-[#1a2b4c] text-white py-3 px-4">
                            <div className="flex justify-center gap-8 items-center text-xs font-medium">
                                <div className="flex flex-col items-center">
                                    <span className="opacity-70">ILIGAN</span>
                                    <span>31°C</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="opacity-70">CDO</span>
                                    <span>32°C</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="opacity-70">MANILA</span>
                                    <span>33°C</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </>
    );
}
