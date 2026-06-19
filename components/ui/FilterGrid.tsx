'use client'

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function FilterGrid({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`container mx-auto px-4 md:px-6 py-6 md:py-12 ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {children}
            </div>
        </div>
    );
}

interface SidebarProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    title?: string;
}

FilterGrid.Sidebar = function FilterGridSidebar({
    categories,
    activeCategory,
    onCategoryChange,
    title = "Filter by Type"
}: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="lg:col-span-3 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                {/* Mobile Toggle Header */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 transition-colors lg:cursor-default lg:pointer-events-none"
                >
                    <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                        {title}
                    </h3>
                    {/* Hamburger / Close icon */}
                    <div className="lg:hidden text-slate-500 bg-white p-1 rounded-md border border-slate-200 shadow-sm">
                        {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </div>
                </button>

                {/* The Options List */}
                <ul className={`flex-col ${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex`}>
                    {categories.map((category) => (
                        <li key={category}>
                            <button
                                onClick={() => {
                                    onCategoryChange(category);
                                    setIsMobileMenuOpen(false); // Auto-close on mobile
                                }}
                                className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${activeCategory === category
                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

interface ContentProps {
    title: string;
    itemCount: number;
    columns?: 1 | 2 | 3 | 4;
    hasSidebar?: boolean;
    children: React.ReactNode;
}

FilterGrid.Content = function FilterGridContent({
    title,
    itemCount,
    columns = 3,
    hasSidebar = true,
    children
}: ContentProps) {

    const gridColsClass = {
        1: 'lg:grid-cols-1',
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
    }[columns];

    const containerSpanClass = hasSidebar ? 'lg:col-span-9' : 'lg:col-span-12';

    return (
        <div className={containerSpanClass}>
            {/* Header: Title and Count Badge */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                    {itemCount} Listed
                </span>
            </div>

            {/* The Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-5`}>
                {children}
            </div>
        </div>
    );
};
