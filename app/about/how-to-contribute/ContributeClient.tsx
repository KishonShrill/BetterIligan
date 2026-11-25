"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import ContributionSection from "./ContributionSection";
import ContributeSidebar from "./ContributeSidebar";
import type { Topic } from "./types";

interface ContributeClientProps {
  topics: Topic[];
}

export default function ContributeClient({ topics }: ContributeClientProps) {
  // Get initial topic from URL hash or default to first topic
  const getInitialTopic = () => {
    if (typeof window === "undefined") return topics[0]?.id || "";
    const hash = window.location.hash.slice(1); // Remove the # symbol
    const topicExists = topics.find((t) => t.id === hash);
    return topicExists ? hash : topics[0]?.id || "";
  };

  const [activeTopicId, setActiveTopicId] = useState<string>(getInitialTopic);

  const currentTopic = topics.find((t) => t.id === activeTopicId);

  // Handle hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const topicExists = topics.find((t) => t.id === hash);
      if (topicExists) {
        setActiveTopicId(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [topics]);

  const handleTopicChange = (topicId: string) => {
    setActiveTopicId(topicId);
    // Update URL hash
    window.location.hash = topicId;
  };

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-12">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Sidebar - Topic Navigation (3 columns) */}
        <aside className="lg:col-span-3">
          <ContributeSidebar
            topics={topics}
            activeSection={activeTopicId}
            onTopicChange={handleTopicChange}
          />
        </aside>

        {/* Main Content Area (9 columns) - Show only current topic */}
        <main className="space-y-12 lg:col-span-9">
          {currentTopic ? (
            <>
              <ContributionSection topic={currentTopic} />

              {/* Disclaimer Section */}
              <aside
                className="rounded-xl border border-amber-200 bg-amber-50 p-6"
                aria-label="Disclaimer"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="mb-2 text-xs font-bold tracking-wider text-amber-900 uppercase">
                      Disclaimer
                    </p>
                    <p className="text-sm leading-relaxed text-amber-900">
                      BetterIliganCity.org is an independent, unofficial civic
                      technology initiative. All contributions are voluntary and
                      do not represent the official views or positions of the
                      Local Government Unit of Iligan City or any government
                      office. This platform is maintained by volunteers as part
                      of the BetterGov Philippines movement.
                    </p>
                  </div>
                </div>
              </aside>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">
                Select a contribution topic from the left sidebar to get
                started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
