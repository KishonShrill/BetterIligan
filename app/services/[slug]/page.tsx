'use client'

// 1. Import `use` from React
import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Building,
    Clock,
    Users,
    Check,
    FileText,
    BadgeCheck,
    Info
} from 'lucide-react';
import { GovernmentService } from '@/types/service';

import servicesData from '@/data/services.json';

const allServices = servicesData as GovernmentService[];

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [activeTab, setActiveTab] = useState<'requirements' | 'procedures'>('requirements');

    const service = allServices.find((s) => s.slug === resolvedParams.slug);

    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleCheck = (id: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(id)) {
            newChecked.delete(id);
        } else {
            newChecked.add(id);
        }
        setCheckedItems(newChecked);
    };

    if (!service) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-20">

            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Directory
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                            {service.category}
                        </span>
                        {service.source === 'official' && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold border border-emerald-200">
                                <BadgeCheck className="w-3.5 h-3.5" /> Official Data
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {service.title}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                        {service.description}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Tabs & Content */}
                <div className="lg:col-span-8">

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => setActiveTab('requirements')}
                            className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'requirements'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            Requirements
                        </button>
                        <button
                            onClick={() => setActiveTab('procedures')}
                            className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'procedures'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            Procedures
                        </button>
                    </div>

                    {/* Tab Content: Requirements */}
                    {activeTab === 'requirements' && (
                        <div className="animate-in fade-in duration-300">
                            {service.requirements?.map((group, idx) => (
                                <div key={idx} className="mb-8 last:mb-0">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 bg-slate-100 px-4 py-2 rounded-lg inline-block">
                                        {group.groupName}
                                    </h3>
                                    <ul className="space-y-3">
                                        {group.items.map((item, itemIdx) => {
                                            // Create a unique ID for each item based on its group and item index
                                            const itemId = `${idx}-${itemIdx}`;
                                            const isChecked = checkedItems.has(itemId);

                                            return (
                                                <li
                                                    key={itemId}
                                                    onClick={() => toggleCheck(itemId)}
                                                    className="flex gap-3 cursor-pointer group"
                                                >
                                                    {/* Custom Checkbox */}
                                                    <div className={`w-5 h-5 mt-0.5 shrink-0 rounded flex items-center justify-center border transition-colors duration-200 ${isChecked
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : 'bg-white border-slate-300 group-hover:border-emerald-400'
                                                        }`}>
                                                        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                                    </div>

                                                    {/* Requirement Text */}
                                                    <span className={`leading-relaxed transition-all duration-200 select-none ${isChecked
                                                        ? 'text-slate-400 line-through'
                                                        : 'text-slate-700 group-hover:text-slate-900'
                                                        }`}>
                                                        {item}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab Content: Procedures */}
                    {activeTab === 'procedures' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            {service.procedures?.map((step) => (
                                <div key={step.stepNumber} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            {step.stepNumber}
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">Step {step.stepNumber}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Applicant Action</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{step.clientAction}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">LGU Action</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{step.providerAction}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 bg-slate-50 p-4 rounded-lg text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium">{step.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <FileText className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium">{step.fee}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Users className="w-4 h-4 text-purple-500" />
                                            <span className="font-medium">{step.personInCharge}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Right Column: Quick Facts Sidebar */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Action/Status Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Availability</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {service.isWalkIn && (
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
                                    Walk-in Available
                                </span>
                            )}
                            {service.isOnline && (
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                                    Online Application
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <Building className="w-3.5 h-3.5" /> Department
                                </p>
                                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                    {service.department}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3.5 h-3.5" /> Schedule
                                </p>
                                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                    {service.schedule}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <Users className="w-3.5 h-3.5" /> Who may avail
                                </p>
                                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                    {service.whoMayAvail}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Help Box */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md">
                        <Info className="w-8 h-8 mb-4 text-blue-200" />
                        <h3 className="font-bold text-lg mb-2">Need help with this?</h3>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                            If you notice outdated information or need assistance understanding these requirements, please let the community know.
                        </p>
                        <button className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors">
                            Suggest an Edit
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
