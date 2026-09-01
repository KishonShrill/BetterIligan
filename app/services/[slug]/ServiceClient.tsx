"use client";

import { useState } from "react";
import {
  Building,
  Clock,
  Users,
  Check,
  FileText,
  BadgeCheck,
  Info,
  ExternalLink,
} from "lucide-react";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { AllService } from "@/validations/serviceSchema";

interface ServiceClientProps {
  service: AllService;
}

export default function ServicePage({ service }: ServiceClientProps) {
  // 1. Dynamically determine which tabs should exist based on the data payload
  const availableTabs: { id: "requirements" | "procedures"; label: string }[] =
    [];

  if (
    "requirements" in service &&
    service.requirements &&
    service.requirements.length > 0
  ) {
    availableTabs.push({ id: "requirements", label: "Requirements" });
  }
  if (
    "procedures" in service &&
    service.procedures &&
    service.procedures.length > 0
  ) {
    availableTabs.push({ id: "procedures", label: "Procedures" });
  }

  // 2. Set the default active tab safely to whatever is available first, or fallback to null
  const [activeTab, setActiveTab] = useState<
    "requirements" | "procedures" | null
  >(availableTabs.length > 0 ? availableTabs[0].id : null);

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

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Top Navigation Bar */}
      <SubpageNav text="Back to Directory" href="/services" />

      {/* Hero Section */}
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            {service.category}
          </span>

          {service.source === "official" && (
            <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Official Data
            </span>
          )}

          {service.source === "community" && (
            <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              <ExternalLink className="h-3.5 w-3.5" /> Community Info
            </span>
          )}
        </SubpageHero.Badges>

        <SubpageHero.Title>{service.title}</SubpageHero.Title>

        <SubpageHero.Description>{service.description}</SubpageHero.Description>
      </SubpageHero>

      {/* Main Content Area */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-12">
        {/* Left Column: Tabs & Content */}
        <div className="lg:col-span-8">
          {/* Dynamic Tab Navigation (Only renders if tabs exist) */}
          {availableTabs.length > 0 && (
            <div className="hide-scrollbar mb-8 flex overflow-x-auto border-b border-slate-200">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content: Requirements */}
          {activeTab === "requirements" &&
            service.type === "standard" &&
            service.requirements && (
              <div className="animate-in fade-in duration-300">
                {service.requirements.map((group, idx) => (
                  <div key={idx} className="mb-8 last:mb-0">
                    <h3 className="mb-4 inline-block rounded-lg bg-slate-100 px-4 py-2 text-lg font-bold text-slate-900">
                      {group.groupName}
                    </h3>
                    <ul className="space-y-3">
                      {group.items.map((item, itemIdx) => {
                        const itemId = `${idx}-${itemIdx}`;
                        const isChecked = checkedItems.has(itemId);

                        return (
                          <li
                            key={itemId}
                            onClick={() => toggleCheck(itemId)}
                            className="group flex cursor-pointer gap-3"
                          >
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-200 ${
                                isChecked
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-slate-300 bg-white group-hover:border-emerald-400"
                              }`}
                            >
                              {isChecked && (
                                <Check
                                  className="h-3.5 w-3.5 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <span
                              className={`leading-relaxed transition-all duration-200 select-none ${
                                isChecked
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700 group-hover:text-slate-900"
                              }`}
                            >
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
          {activeTab === "procedures" &&
            service.type === "standard" &&
            service.procedures && (
              <div className="animate-in fade-in space-y-6 duration-300">
                {service.procedures.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {step.stepNumber}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Step {step.stepNumber}
                      </h3>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Applicant Action
                        </p>
                        <p className="text-sm leading-relaxed text-slate-700">
                          {step.clientAction}
                        </p>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                          LGU Action
                        </p>
                        <p className="text-sm leading-relaxed text-slate-700">
                          {step.providerAction}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{step.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{step.fee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">
                          {step.personInCharge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Fallback for External Links / Services with zero tabs */}
          {availableTabs.length === 0 && service.type === "external" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Info className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                External Portal Redirection
              </h3>
              <p className="mx-auto mb-6 max-w-md text-slate-600">
                This service is processed via an external platform or agency
                portal. Click the button below to visit their live link.
              </p>
              <a
                href={service.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-blue-700"
              >
                Access Service Portal
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Quick Facts Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Action/Status Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Availability
            </h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {service.isWalkIn && (
                <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  Walk-in Available
                </span>
              )}
              {service.isOnline && (
                <span className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  Online Application
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <Building className="h-3.5 w-3.5" /> Department
                </p>
                {service.type !== "internal" &&
                  service.type !== "custom_link" && (
                    <p className="text-sm leading-relaxed font-medium text-slate-800">
                      {service.department}
                    </p>
                  )}
              </div>
              {service.type === "standard" && (
                <>
                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <Clock className="h-3.5 w-3.5" /> Schedule
                    </p>
                    <p className="text-sm leading-relaxed font-medium text-slate-800">
                      {service.schedule}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <Users className="h-3.5 w-3.5" /> Who may avail
                    </p>
                    <p className="text-sm leading-relaxed font-medium text-slate-800">
                      {service.whoMayAvail}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Help Box */}
          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-md">
            <Info className="mb-4 h-8 w-8 text-blue-200" />
            <h3 className="mb-2 text-lg font-bold">Need help with this?</h3>
            <p className="mb-4 text-sm leading-relaxed text-blue-100">
              If you notice outdated information or need assistance
              understanding these requirements, please let the community know.
            </p>
            <button className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50">
              Suggest an Edit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
