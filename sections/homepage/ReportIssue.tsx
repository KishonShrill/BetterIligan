"use client";

import { useState } from "react";
import { AlertTriangle, Flag } from "lucide-react";
import Section from "@/components/ui/Section";
import Button3D from "@/components/ui/Button3D";
import ReportIssueModal from "@/components/modals/ReportIssueModal";

export default function ReportIssueSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Section className="border-t border-slate-200/60 bg-blue-100 py-12 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md md:flex-row md:gap-8 md:p-8 md:text-left">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
          {/* Icon Block */}
          <div className="shrink-0 rounded-2xl border border-orange-100 bg-orange-50 p-3 text-orange-500 md:p-4">
            <Flag className="h-8 w-8 md:h-6 md:w-6" />
          </div>

          {/* Text Content */}
          <div>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Spot an error or outdated info?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
              BetterIliganCity relies on community feedback. If you notice a
              broken link, incorrect procedure, or outdated contact detail, let
              us know so we can fix it!
            </p>
          </div>
        </div>

        {/* CTA Button routing to the /report page we converted earlier */}
        <div className="mt-2 w-full shrink-0 md:mt-0 md:w-auto">
          <Button3D
            text="Report an Issue"
            onClick={() => setIsModalOpen(true)}
            size="md"
            icon={AlertTriangle}
            variant="orange"
            animateIcon={false}
            className="w-full justify-center md:w-auto"
          />
        </div>
      </div>

      <ReportIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
}
