'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home } from 'lucide-react';

const bureaucracyMessages = [
    "Relax, even the best systems have their maze-like moments. This page seems to have gotten stuck in processing... probably waiting for approval from three (or more) different departments.",
    "We've searched the digital filing cabinets and checked with the barangay hall, but this page is officially missing in action.",
    "Looks like this link was filed in the wrong folder. Our digital clerks are looking for it, but they might be on their merienda break.",
    "This page is currently pending a resolution from the city council. While we wait for the gavel to strike, maybe head back home?",
    "404: Form not found. You might need to submit a request in triplicate and present your cedula to view this URL. Just kidding, try heading back."
];

export default function NotFound() {
    const router = useRouter();

    // Initialize with the first message to prevent SSR hydration errors
    const [description, setDescription] = useState(bureaucracyMessages[0]);

    useEffect(() => {
        // Randomize the message only after the component mounts on the client
        const randomIndex = Math.floor(Math.random() * bureaucracyMessages.length);
        setDescription(bureaucracyMessages[randomIndex]);
    }, []);

    return (
        <main className="min-h-[80vh] font-sans flex flex-col items-center justify-center bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-center">
            {/* Icon */}
            <div className="bg-white/20 p-6 rounded-full mb-6 backdrop-blur-sm border border-white/10">
                <AlertTriangle className="w-12 h-12 font-semibold text-white" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight">
                404
            </h1>

            {/* Subheading */}
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Lost in the Digital Bureaucracy?
            </h2>

            {/* Description */}
            <p className="max-w-2xl text-blue-50 text-base md:text-base mb-10 leading-relaxed font-light min-h-16">
                {description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-[18px] justify-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-sm"
                >
                    <Home className="w-5 h-5" />
                    Return to Homepage
                </Link>

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-[18px] justify-center px-6 py-2.5 bg-transparent border border-white/70 text-white rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </main>
    );
}
