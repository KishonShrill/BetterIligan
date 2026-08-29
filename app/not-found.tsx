"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home } from "lucide-react";

const bureaucracyMessages = [
  "Relax, even the best systems have their maze-like moments. This page seems to have gotten stuck in processing... probably waiting for approval from three (or more) different departments.",
  "We've searched the digital filing cabinets and checked with the barangay hall, but this page is officially missing in action.",
  "Looks like this link was filed in the wrong folder. Our digital clerks are looking for it, but they might be on their merienda break.",
  "This page is currently pending a resolution from the city council. While we wait for the gavel to strike, maybe head back home?",
  "404: Form not found. You might need to submit a request in triplicate and present your cedula to view this URL. Just kidding, try heading back.",
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
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-center font-sans">
      {/* Icon */}
      <div className="mb-6 rounded-full border border-white/10 bg-white/20 p-6 backdrop-blur-sm">
        <AlertTriangle
          className="h-12 w-12 font-semibold text-white"
          strokeWidth={2}
        />
      </div>

      {/* Heading */}
      <h1 className="mb-4 text-7xl font-bold tracking-tight text-white md:text-8xl">
        404
      </h1>

      {/* Subheading */}
      <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
        Lost in the Digital Bureaucracy?
      </h2>

      {/* Description */}
      <p className="mb-10 min-h-16 max-w-2xl text-base leading-relaxed font-light text-blue-50 md:text-base">
        {description}
      </p>

      {/* Buttons */}
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-2.5 text-[18px] font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
        >
          <Home className="h-5 w-5" />
          Return to Homepage
        </Link>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-md border border-white/70 bg-transparent px-6 py-2.5 text-[18px] font-medium text-white transition-colors hover:bg-white/10"
        >
          Go Back
        </button>
      </div>
    </main>
  );
}
