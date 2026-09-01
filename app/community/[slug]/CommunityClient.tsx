"use client";

import {
  Globe,
  Facebook,
  Instagram,
  Phone,
  MessageCircle,
  User,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";

import { serviceCategories } from "@/data/categories";
import { AllService } from "@/validations/serviceSchema";

interface CommunityClientProps {
  community: AllService;
}

export default function CommunityClient({ community }: CommunityClientProps) {
  const categoryData = serviceCategories.find(
    (c) => c.name === community?.category || c.slug === community?.category,
  );

  const CategoryIcon = categoryData?.icon || Briefcase;

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Top Navigation Bar */}
      <SubpageNav />

      {/* Hero Section */}
      <SubpageHero
        bannerUrl={
          community.type === "internal" ? community.bannerUrl : undefined
        }
        logoUrl={community.type === "internal" ? community.logoUrl : undefined}
      >
        <SubpageHero.Badges>
          <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold tracking-wider text-purple-700 uppercase">
            Community Profile
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
            <CategoryIcon className="h-3.5 w-3.5 text-slate-500" />
            {community.category}
          </span>

          <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Partner
          </span>
        </SubpageHero.Badges>

        <SubpageHero.Title>{community.title}</SubpageHero.Title>

        <SubpageHero.Description>
          {community.description}
        </SubpageHero.Description>
      </SubpageHero>

      {/* Main Content Area */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-12">
        {/* Left Column: Content */}
        <div className="lg:col-span-8">
          <div className="mb-8">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Programs & Services
            </h3>

            {community.type === "internal" &&
            community.offeredServices &&
            community.offeredServices.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {community.offeredServices.map((serviceName, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm leading-relaxed font-semibold text-slate-800 capitalize">
                      {serviceName.replace(/-/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Briefcase className="mb-3 h-8 w-8 text-slate-300" />
                <p className="max-w-sm text-sm font-medium text-slate-500">
                  No specific programs have been listed for this partner yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Facts Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Official Channels Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Official Channels
            </h3>
            <div className="flex flex-col gap-3">
              {community.type === "internal" && community.websiteUrl && (
                <a
                  href={community.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
                      Website
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                </a>
              )}

              {community.type === "internal" && community.facebookUrl && (
                <a
                  href={community.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
                      Facebook Page
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                </a>
              )}

              {community.type === "internal" && community.instagramUrl && (
                <a
                  href={community.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-slate-400 transition-colors group-hover:text-pink-500" />
                    <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-pink-700">
                      Instagram
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-pink-500" />
                </a>
              )}

              {community.type === "internal" &&
                !community.websiteUrl &&
                !community.facebookUrl &&
                !community.instagramUrl && (
                  <p className="px-2 text-xs text-slate-500 italic">
                    No external links available.
                  </p>
                )}
            </div>
          </div>

          {/* Point of Contact Card */}
          {community.type === "internal" && community.representative && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Point of Contact
              </h3>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="line-clamp-1 text-sm font-bold text-slate-900">
                    {community.representative.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                    Representative
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                {community.representative.contactNumber && (
                  <div className="flex items-center gap-3 p-2 text-sm text-slate-700">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="font-medium">
                      {community.representative.contactNumber}
                    </span>
                  </div>
                )}

                {community.representative.messengerUrl && (
                  <a
                    href={community.representative.messengerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-lg p-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-800"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-blue-500 group-hover:text-blue-600" />
                    Message on Messenger
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
