"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Globe,
  Facebook,
  Building,
  User,
  Phone,
  Mail,
} from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { allDepartments } from "@/data/government/departments";
import { DepartmentCategory } from "@/validations/agencySchema";
import FilterGrid from "@/components/ui/FilterGrid";
import ReferencesFooter from "@/components/ui/ReferencesFooter";

const CATEGORIES: DepartmentCategory[] = [
  "All Departments",
  "Social Services",
  "Public Administration",
  "Infrastructure",
  "Fiscal Management",
  "City Mayors Office",
];

export default function DirectoryClient() {
  const [activeCategory, setActiveCategory] =
    useState<DepartmentCategory>("All Departments");

  const departmentReferences = [
    {
      title: "iligan.gov.ph - Departments",
      url: "https://iligan.gov.ph/forresidents/departments?1405408361",
    },
  ];

  const filteredDepartments =
    activeCategory === "All Departments"
      ? allDepartments
      : allDepartments.filter(
          (department) => department.category === activeCategory,
        );

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            Official Directory
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Government Departments</SubpageHero.Title>
        <SubpageHero.Description>
          Explore the official directory of Iligan City&apos;s local government
          departments, administrative offices, and public services operating
          under the City Hall.
        </SubpageHero.Description>
      </SubpageHero>

      {/* Main Layout */}
      <div className="container mx-auto py-12">
        <FilterGrid className="py-0!">
          <FilterGrid.Sidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={(category) =>
              setActiveCategory(category as DepartmentCategory)
            }
            title="Filter by Type"
          />

          <FilterGrid.Content
            title={activeCategory}
            itemCount={filteredDepartments.length}
            columns={3}
          >
            {filteredDepartments.map((department, idx) => {
              const hasUrls = department.websiteUrl || department.facebookUrl;

              return (
                <div
                  key={idx}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Top: Logo & Category Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2">
                      {department.logoUrl ? (
                        <Image
                          src={department.logoUrl}
                          alt={department.name}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <Building className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-right text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {department.category}
                    </span>
                  </div>

                  {/* Middle: Title, Address & Contact Details */}
                  <div className={`flex-1 ${hasUrls && "mb-6"}`}>
                    <h3 className="mb-3 text-lg leading-tight font-bold text-slate-900">
                      {department.name}
                    </h3>

                    {/* Address */}
                    {department.address && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(department.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-4 flex items-start gap-1.5 text-sm text-slate-500"
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="line-clamp-2 text-blue-500 underline">
                          {department.address}
                        </span>
                      </a>
                    )}

                    {/* Contact Details (Only renders if at least ONE exists) */}
                    {(department.representative.name ||
                      department.representative.numbers ||
                      department.representative.emails) && (
                      <div className="space-y-2.5 border-t border-slate-100 pt-4">
                        {/* Head/Representative */}
                        {department.representative.name && (
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <span>
                              <span className="font-semibold text-slate-700">
                                Head:
                              </span>{" "}
                              {department.representative.name}
                            </span>
                          </div>
                        )}

                        {/* Phone Numbers */}
                        {department.representative.numbers &&
                          department.representative.numbers.length > 0 && (
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <div className="flex flex-col gap-1">
                                {department.representative.numbers.map(
                                  (number, i) => (
                                    <a
                                      key={i}
                                      href={`tel:${number}`}
                                      className="break-all transition-colors hover:text-blue-600"
                                    >
                                      {number}
                                    </a>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Emails */}
                        {department.representative.emails &&
                          department.representative.emails.length > 0 && (
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <div className="flex flex-col gap-1">
                                {department.representative.emails.map(
                                  (email, i) => (
                                    <a
                                      key={i}
                                      href={`mailto:${email}`}
                                      className="break-all transition-colors hover:text-blue-600"
                                    >
                                      {email}
                                    </a>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Action Buttons */}
                  {hasUrls && (
                    <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
                      {/* Website Button */}
                      {department.websiteUrl && (
                        <a
                          href={department.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                          title="Visit Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}

                      {/* Facebook Button */}
                      {department.facebookUrl && (
                        <a
                          href={department.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                          title="Visit Facebook Page"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </FilterGrid.Content>
        </FilterGrid>
        <ReferencesFooter className="mx-4" references={departmentReferences} />
      </div>
    </main>
  );
}
