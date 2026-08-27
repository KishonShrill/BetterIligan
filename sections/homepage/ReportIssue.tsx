'use client';

import { useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import Section from '@/components/ui/Section';
import Button3D from '@/components/ui/Button3D';
import ReportIssueModal from '@/components/modals/ReportIssueModal';

export default function ReportIssueSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <Section className="bg-blue-100 border-t border-slate-200/60 py-12 md:py-16">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 md:gap-8 bg-white border border-slate-200/80 shadow-sm p-6 md:p-8 rounded-3xl transition-shadow hover:shadow-md">

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                    {/* Icon Block */}
                    <div className="bg-orange-50 border border-orange-100 p-3 md:p-4 rounded-2xl text-orange-500 shrink-0">
                        <Flag className="w-8 h-8 md:w-6 md:h-6" />
                    </div>

                    {/* Text Content */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                            Spot an error or outdated info?
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
                            BetterIliganCity relies on community feedback. If you notice a broken link, incorrect procedure, or outdated contact detail, let us know so we can fix it!
                        </p>
                    </div>
                </div>

                {/* CTA Button routing to the /report page we converted earlier */}
                <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    <Button3D
                        text="Report an Issue"
                        onClick={() => setIsModalOpen(true)}
                        size="md"
                        icon={AlertTriangle}
                        variant="orange"
                        animateIcon={false}
                        className="w-full md:w-auto justify-center"
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
