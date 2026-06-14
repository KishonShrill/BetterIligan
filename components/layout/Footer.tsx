import Link from 'next/link';
import { Facebook, Github } from 'lucide-react';

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const footerSections: FooterSection[] = [
    {
        title: 'About',
        links: [
            { label: 'Contact Us', href: '/about' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'All Services', href: '/services' },
            { label: 'Business and Trade', href: '/services?category=Business%2C+Trade+and+Investment' },
            { label: 'Certificates and Vital Records', href: '/services?category=Certificates+and+Vital+Records' },
            { label: 'Health', href: '/services?category=Health+and+Wellness' },
        ],
    },
    {
        title: 'Government',
        links: [
            { label: 'City Officials', href: '/government' },
            { label: 'Departments', href: '/government' },
            { label: 'Barangays', href: '/iligan/barangays' },
            { label: 'Transparency', href: '/transparency' },
        ],
    },
    {
        title: 'Official',
        links: [
            { label: 'iligan.gov.ph', href: 'https://iligan.gov.ph/', external: true }
        ],
    }
];

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
                    <div className='col-span-1 sm:col-span-2'>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                BI
                            </div>
                            <div className="font-bold">BetterIligan</div>
                        </div>
                        <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                            Open-source civic tech initiative making government information
                            accessible for Iliganons.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/KishonShrill/BetterIligan"
                                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.facebook.com/BetterIliganCity.org"
                                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
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

                <div className="border-t border-slate-800 mt-10 pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} BetterIligan · Not an official
                            government website
                        </p>
                        <Link
                            href="/sitemap"
                            className="text-slate-500 hover:text-white text-sm transition-colors"
                        >
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
