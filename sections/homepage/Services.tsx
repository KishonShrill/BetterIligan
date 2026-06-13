'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import Button3D from '@/components/ui/Button3D';
import { serviceCategories } from '@/data/categories';


export default function ServicesSection() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Only show the first 4 if not expanded
    const displayedCategories = isExpanded
        ? serviceCategories
        : serviceCategories.slice(0, 4);

    return (
        <Section>

            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Government Services
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Access official government services quickly and easily. Find what you need for citizenship, business, education, and more.
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {displayedCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.name}
                            className="border border-slate-200 rounded-xl p-6 flex flex-col h-full hover:border-blue-500 hover:shadow-md transition-all duration-300"
                        >
                            {/* Icon & Title */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {category.name}
                                </h3>
                            </div>

                            {category.description && (
                                <p className={`text-sm text-slate-600 leading-relaxed ${category.subItems.length > 0 ? 'mb-5' : 'mb-8 flex-1'}`}>
                                    {category.description}
                                </p>
                            )}

                            {/* Sub-items List */}
                            {category.subItems.length > 0 && <ul className="space-y-3 mb-8 flex-1">
                                {category.subItems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>}

                            {/* Action Link */}
                            <Link
                                href={category.href}
                                className="text-blue-600 font-semibold text-sm flex items-center gap-1.5 group w-fit"
                            >
                                View More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Toggle Button */}
            <div className="flex justify-center">
                <Button3D
                    text={isExpanded ? 'Show Less' : 'View All Services'}
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="blue"
                />
            </div>

        </Section >
    );
}
