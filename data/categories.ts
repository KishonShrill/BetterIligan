import {
    Building2,
    FileText,
    HeartPulse,
    HardHat,
    Car,
    PawPrint
} from 'lucide-react';

export const serviceCategories = [
    {
        name: 'Business, Trade and Investment',
        slug: 'business-trade-and-investment',
        description: 'Resources and services for starting, managing, and growing a business, including permits, taxes, and local investment opportunities.',
        href: '/services?category=Business%2C+Trade+and+Investment',
        icon: Building2,
        subItems: []
    },
    {
        name: 'Certificates and Vital Records',
        slug: 'certificates-and-vital-records',
        description: 'Official documentation services including birth, marriage, and death certificates, as well as clearances and personal records.',
        href: '/services?category=Certificates+and+Vital+Records',
        icon: FileText,
        subItems: []
    },
    {
        name: 'Health and Wellness',
        slug: 'health-and-wellness',
        description: 'Public health services, medical assistance, community wellness programs, and access to local healthcare facilities.',
        href: '/services?category=Health+and+Wellness',
        icon: HeartPulse,
        subItems: []
    },
    {
        name: 'Infrastructure and Public Works',
        slug: 'infrastructure-and-public-works',
        description: 'Services related to city infrastructure, road maintenance, public utilities, and building or construction permits.',
        href: '/services?category=Infrastructure+and+Public+Works',
        icon: HardHat,
        subItems: []
    },
    {
        name: 'Transport and Driving',
        slug: 'transport-and-driving',
        description: 'Information and services for vehicle registration, driver licensing, traffic regulations, and public transportation.',
        href: '/services?category=Transport+and+Driving',
        icon: Car,
        subItems: []
    },
    {
        name: 'Animal Welfare',
        slug: 'animal-welfare',
        description: 'Veterinary services, pet registration, animal bite treatment centers, and responsible pet ownership programs.',
        href: '/services?category=Animal+Welfare',
        icon: PawPrint,
        subItems: []
    }
].sort((a, b) => a.name.localeCompare(b.name));

// You can still export your dropdown list for the Header here if you want!
export const headerDropdown = [
    { name: 'All Services', href: '/services' },
    ...serviceCategories.map(cat => ({ name: cat.name, href: cat.href }))
];
