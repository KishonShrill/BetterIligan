'use client'

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SubpageNavProps {
    text?: string; // Optional: Defaults to "Go Back"
    href?: string; // Optional: If provided, it becomes a Link. If not, it becomes a back button.
}

export default function SubpageNav({ text = "Go Back", href }: SubpageNavProps) {
    const interactionClasses = "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors";

    return (
        <div className="bg-white border-b border-slate-200">
            {/* Standardized width to match your SubpageHero perfectly */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
                {href ? (
                    <Link href={href} className={interactionClasses}>
                        <ArrowLeft className="w-4 h-4" />
                        {text}
                    </Link>
                ) : (
                    <button onClick={() => window.history.back()} className={interactionClasses}>
                        <ArrowLeft className="w-4 h-4" />
                        {text}
                    </button>
                )}
            </div>
        </div>
    );
}
