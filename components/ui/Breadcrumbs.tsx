'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const pathname = usePathname();

    const breadcrumbItems = items || generateFromPath(pathname);

    return (
        <nav
            className={cn('container flex items-center space-x-1 text-xs text-gray-600', className)}
            aria-label="Breadcrumb"
        >
            {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.label + index}>
                    {index === 0 && <Home className="h-4 w-4 shrink-0" />}
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary-600 transition-colors truncate max-w-[150px]"
                            title={item.label}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className="text-gray-900 font-medium truncate max-w-[200px]"
                            title={item.label}
                            aria-current="page"
                        >
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

function generateFromPath(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        const label = segment
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        crumbs.push({ label, href: isLast ? undefined : currentPath });
    });

    return crumbs;
}
