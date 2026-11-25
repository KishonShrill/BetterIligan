import type { Topic } from "./types";
import StepCard from "./StepCard";
import { FileText } from "lucide-react";

interface ContributionSectionProps {
  topic: Topic;
}

export default function ContributionSection({
  topic,
}: ContributionSectionProps) {
  return (
    <article className="space-y-8">
      {/* Topic Header */}
      <div className="flex items-start gap-4 border-b border-slate-200 pb-6">
        <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            {topic.title}
          </h2>
          <p className="text-base text-slate-600">{topic.description}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {topic.steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            length={topic.steps.length}
          />
        ))}
      </div>
    </article>
  );
}
