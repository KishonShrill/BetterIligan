'use client'

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Globe, Facebook, Building, User, Phone, Mail } from 'lucide-react';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { allDepartments } from '@/data/government/departments';
import { DepartmentCategory } from '@/validations/agencySchema';
import FilterGrid from '@/components/ui/FilterGrid';

const CATEGORIES: (DepartmentCategory)[] = [
    'All Departments',
    'Social Services',
    'Public Administration',
    'Infrastructure',
    'Fiscal Management',
    'City Mayors Office'
];

export default function DirectoryClient() {
    const [activeCategory, setActiveCategory] = useState<DepartmentCategory>('All Departments');

    const filteredDepartments = activeCategory === 'All Departments'
        ? allDepartments
        : allDepartments.filter(department => department.category === activeCategory);

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">


            <SubpageNav />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                        Official Directory
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Government Departments</SubpageHero.Title>
                <SubpageHero.Description>
                    Explore the official directory of Iligan City&apos;s local government departments, administrative offices, and public services operating under the City Hall.
                </SubpageHero.Description>
            </SubpageHero>

            {/* Main Layout */}
            <FilterGrid>

                {/* 1. The Sidebar */}
                <FilterGrid.Sidebar
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onCategoryChange={(category) => setActiveCategory(category as DepartmentCategory)}
                    title="Filter by Type"
                />

                {/* 2. The Content Area */}
                <FilterGrid.Content
                    title={activeCategory}
                    itemCount={filteredDepartments.length}
                    columns={3}
                >
                    {filteredDepartments.map((department, idx) => {
                        const hasUrls = department.websiteUrl || department.facebookUrl

                        return (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">

                                {/* Top: Logo & Category Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center relative overflow-hidden shrink-0">
                                        {department.logoUrl ? (
                                            <Image src={department.logoUrl} alt={department.name} fill className="object-contain p-1" sizes="56px" />
                                        ) : (
                                            <Building className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded text-right ml-2">
                                        {department.category}
                                    </span>
                                </div>

                                {/* Middle: Title, Address & Contact Details */}
                                <div className={`flex-1 ${hasUrls && 'mb-6'}`}>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                                        {department.name}
                                    </h3>

                                    {/* Address */}
                                    {department.address && (
                                        <p className="text-sm text-slate-500 flex items-start gap-1.5 mb-4">
                                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">{department.address}</span>
                                        </p>
                                    )}

                                    {/* Contact Details (Only renders if at least ONE exists) */}
                                    {(department.representative.name || department.representative.numbers || department.representative.emails) && (
                                        <div className="space-y-2.5 pt-4 border-t border-slate-100">

                                            {/* Head/Representative */}
                                            {department.representative.name && (
                                                <div className="text-sm text-slate-600 flex items-start gap-2">
                                                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <span><span className="font-semibold text-slate-700">Head:</span> {department.representative.name}</span>
                                                </div>
                                            )}

                                            {/* Phone Numbers */}
                                            {department.representative.numbers && department.representative.numbers.length > 0 && (
                                                <div className="text-sm text-slate-600 flex items-start gap-2">
                                                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <div className='flex flex-col gap-1'>
                                                        {department.representative.numbers.map((number, i) => (
                                                            <a
                                                                key={i}
                                                                href={`tel:${number}`}
                                                                className="hover:text-blue-600 transition-colors break-all"
                                                            >
                                                                {number}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Emails */}
                                            {department.representative.emails && department.representative.emails.length > 0 && (
                                                <div className="text-sm text-slate-600 flex items-start gap-2">
                                                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <div className="flex flex-col gap-1">
                                                        {department.representative.emails.map((email, i) => (
                                                            <a
                                                                key={i}
                                                                href={`mailto:${email}`}
                                                                className="hover:text-blue-600 transition-colors break-all"
                                                            >
                                                                {email}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom: Action Buttons */}
                                {hasUrls && (
                                    <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                                        {/* Website Button */}
                                        {department.websiteUrl && (
                                            <a
                                                href={department.websiteUrl} target="_blank" rel="noopener noreferrer"
                                                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                                                title="Visit Website"
                                            >
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}

                                        {/* Facebook Button */}
                                        {department.facebookUrl && (
                                            <a
                                                href={department.facebookUrl} target="_blank" rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                                                title="Visit Facebook Page"
                                            >
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </FilterGrid.Content>

            </FilterGrid>
        </main>
    );
}
