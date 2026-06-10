import {
    Building2,
    FileText,
    HeartPulse,
    HardHat,
    Car
} from 'lucide-react';

export const serviceCategories = [
    {
        name: 'Business, Trade and Investment',
        href: '/services?category=Business%2C+Trade+and+Investment',
        icon: Building2,
        subItems: []
    },
    {
        name: 'Certificates and Vital Records',
        href: '/services?category=Certificates+and+Vital+Records',
        icon: FileText,
        subItems: []
    },
    {
        name: 'Health and Wellness',
        href: '/services?category=Health+and+Wellness',
        icon: HeartPulse,
        subItems: []
    },
    {
        name: 'Infrastructure and Public Works',
        href: '/services?category=Infrastructure+and+Public+Works',
        icon: HardHat,
        subItems: []
    },
    {
        name: 'Transport and Driving',
        href: '/services?category=Transport+and+Driving',
        icon: Car,
        subItems: []
    }
];

// You can still export your dropdown list for the Header here if you want!
export const headerDropdown = [
    { name: 'All Services', href: '/services' },
    ...serviceCategories.map(cat => ({ name: cat.name, href: cat.href }))
];
