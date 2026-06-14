import {
    Building2, FileText, HeartPulse,
    HardHat, Car, PawPrint,
    Trash2, Leaf, ShieldAlert
} from 'lucide-react';

export const serviceCategories = [
    {
        name: 'Business, Trade and Investment',
        slug: 'business-trade-and-investment',
        description: 'Resources and services for starting, managing, and growing a business, including permits, taxes, and local investment opportunities.',
        href: '/services?category=Business%2C+Trade+and+Investment',
        icon: Building2,
        secondaryColor: 'bg-blue-50',
        primaryColor: 'text-blue-600',
        hoverBorder: 'hover:border-blue-300',
        subItems: []
    },
    {
        name: 'Certificates and Vital Records',
        slug: 'certificates-and-vital-records',
        description: 'Official documentation services including birth, marriage, and death certificates, as well as clearances and personal records.',
        href: '/services?category=Certificates+and+Vital+Records',
        icon: FileText,
        secondaryColor: 'bg-amber-50',
        primaryColor: 'text-amber-600',
        hoverBorder: 'hover:border-amber-300',
        subItems: []
    },
    {
        name: 'Health and Wellness',
        slug: 'health-and-wellness',
        description: 'Public health services, medical assistance, community wellness programs, and access to local healthcare facilities.',
        href: '/services?category=Health+and+Wellness',
        icon: HeartPulse,
        secondaryColor: 'bg-rose-50',
        primaryColor: 'text-rose-600',
        hoverBorder: 'hover:border-rose-300',
        subItems: []
    },
    {
        name: 'Infrastructure and Public Works',
        slug: 'infrastructure-and-public-works',
        description: 'Services related to city infrastructure, road maintenance, public utilities, and building or construction permits.',
        href: '/services?category=Infrastructure+and+Public+Works',
        icon: HardHat,
        secondaryColor: 'bg-orange-50',
        primaryColor: 'text-orange-600',
        hoverBorder: 'hover:border-orange-300',
        subItems: []
    },
    {
        name: 'Transport and Driving',
        slug: 'transport-and-driving',
        description: 'Information and services for vehicle registration, driver licensing, traffic regulations, and public transportation.',
        href: '/services?category=Transport+and+Driving',
        icon: Car,
        secondaryColor: 'bg-violet-50',
        primaryColor: 'text-violet-600',
        hoverBorder: 'hover:border-violet-300',
        subItems: []
    },
    {
        name: 'Animal Welfare',
        slug: 'animal-welfare',
        description: 'Veterinary services, pet registration, animal bite treatment centers, and responsible pet ownership programs.',
        href: '/services?category=Animal+Welfare',
        icon: PawPrint,
        secondaryColor: 'bg-emerald-50',
        primaryColor: 'text-emerald-600',
        hoverBorder: 'hover:border-emerald-300',
        subItems: []
    },
    {
        name: 'Disaster Preparedness',
        slug: 'disaster-preparedness',
        description: 'Emergency response resources, evacuation protocols, flood warnings, and community disaster risk reduction management.',
        href: '/services?category=Disaster+Preparedness',
        icon: ShieldAlert,
        secondaryColor: 'bg-red-50',
        primaryColor: 'text-red-600',
        hoverBorder: 'hover:border-red-300',
        subItems: []
    }
    /* --- PENDING CATEGORIES (Awaiting Data) --- */
    /*
    {
        name: 'Garbage and Waste Disposal',
        slug: 'garbage-and-waste-disposal',
        description: 'Services for residential and commercial waste collection, recycling programs, and solid waste management guidelines.',
        href: '/services?category=Garbage+and+Waste+Disposal',
        icon: Trash2,
        secondaryColor: 'bg-zinc-50',
        primaryColor: 'text-zinc-600',
        hoverBorder: 'hover:border-zinc-300',
        subItems: []
    },
    {
        name: 'Environment',
        slug: 'environment',
        description: 'Programs and services dedicated to environmental protection, conservation efforts, tree planting, and pollution control.',
        href: '/services?category=Environment',
        icon: Leaf,
        secondaryColor: 'bg-green-50',
        primaryColor: 'text-green-600',
        hoverBorder: 'hover:border-green-300',
        subItems: []
    },
    */
].sort((a, b) => a.name.localeCompare(b.name));

// You can still export your dropdown list for the Header here if you want!
export const headerDropdown = [
    { name: 'All Services', href: '/services' },
    ...serviceCategories.map(cat => ({ name: cat.name, href: cat.href }))
];
