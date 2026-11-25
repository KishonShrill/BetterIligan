"use client";

import { cn } from "@/lib/utils";
import type { Topic } from "./types";
import { FileText } from "lucide-react";

interface ContributeSidebarProps {
  topics: Topic[];
  activeSection: string;
  onTopicChange: (topicId: string) => void;
}

export default function ContributeSidebar({
  topics,
  activeSection,
  onTopicChange,
}: ContributeSidebarProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    topicId: string,
  ) => {
    e.preventDefault();
    onTopicChange(topicId);
    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 md:px-5 md:py-4">
          <h3 className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">
            CONTRIBUTE
          </h3>
        </div>
        <ul className="flex flex-col">
          {topics.map((topic) => (
            <li key={topic.id}>
              <a
                href={`#${topic.id}`}
                onClick={(e) => handleClick(e, topic.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-l-2 px-4 py-3.5 text-left text-sm font-medium transition-colors md:px-5",
                  activeSection === topic.id
                    ? "border-blue-600 bg-blue-50/50 text-blue-700"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>{topic.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
