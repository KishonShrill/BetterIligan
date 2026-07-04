'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface SidebarProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    title?: string;
}

export default function FilterGridSidebar({
    categories,
    activeCategory,
    onCategoryChange,
    title = "Filter by Type"
}: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="lg:col-span-3 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 transition-colors lg:cursor-default lg:pointer-events-none"
                >
                    <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                        {title}
                    </h3>
                    <div className="lg:hidden text-slate-500 bg-white p-1 rounded-md border border-slate-200 shadow-sm">
                        {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </div>
                </button>

                <ul className={`flex-col ${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex`}>
                    {categories.map((category) => (
                        <li key={category}>
                            <button
                                onClick={() => {
                                    onCategoryChange(category);
                                    setIsMobileMenuOpen(false);
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
}
