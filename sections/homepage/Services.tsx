"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Text } from "@/components/ui/Text";
import Section from "@/components/ui/Section";
import Button3D from "@/components/ui/Button3D";
import { serviceCategories } from "@/data/categories";

export default function ServicesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show the first 4 if not expanded
  const displayedCategories = isExpanded
    ? serviceCategories
    : serviceCategories.slice(0, 4);

  return (
    <Section>
      {/* Header */}
      <div className="mb-7 text-center sm:mb-12">
        <h2 className="mb-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
          City Services
        </h2>
        <Text
          className="mx-auto max-w-2xl text-sm text-slate-500 md:text-base"
          size="md"
        >
          Access all list of services quickly and easily. Find what you need for
          citizenship, business, education, and more.
        </Text>
      </div>

      {/* Services Grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {displayedCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={category.href}
              // ADDED: 'relative' to keep the absolute icon contained
              className={`group relative flex h-full flex-col rounded-xl border border-slate-200 p-6 ${category.hoverBorder} transition-all duration-300 hover:shadow-md`}
            >
              {/* --- NEW: Mobile-only top-right icon --- */}
              <div className="absolute top-5 right-5 text-slate-300 transition-colors duration-200 group-hover:text-blue-500 md:hidden">
                <ArrowUpRight className="h-5 w-5" />
              </div>

              {/* Icon & Title */}
              <div className="mb-4 flex items-center gap-4 sm:mb-6">
                <div
                  className={`${category.secondaryColor} ${category.primaryColor} shrink-0 rounded-xl p-3 transition-colors`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="pr-6 text-lg leading-tight font-bold text-slate-900">
                  {category.name}
                </h3>
              </div>

              {category.description && (
                <p
                  className={`text-sm leading-relaxed text-slate-600 ${category.subItems.length > 0 ? "mb-5" : "mb-0 flex-1"}`}
                >
                  {category.description}
                </p>
              )}

              {/* Sub-items List */}
              {category.subItems.length > 0 && (
                <ul className="mb-8 flex-1 space-y-3">
                  {category.subItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Link (Hidden on mobile, visible on desktop) */}
              <span className="hidden w-fit items-center gap-1.5 self-end text-sm font-semibold text-blue-600 md:flex">
                View More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center">
        <Button3D
          text={isExpanded ? "Show Less" : "View All Services"}
          onClick={() => setIsExpanded(!isExpanded)}
          variant="blue"
        />
      </div>
    </Section>
  );
}
