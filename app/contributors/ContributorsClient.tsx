"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, ShieldCheck, Heart, User, Loader2 } from "lucide-react";
import communityVolunteers from "@/data/community-volunteers.json";

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface CommunityVolunteer {
  name: string;
  profession: string;
  profile_pic?: string;
}

export default function ContributorsClient() {
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/KishonShrill/BetterIligan/contributors",
          {
            headers: {
              "User-Agent": "BetterIligan-Contributors-Page",
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch GitHub contributors");

        const data = await res.json();

        // Defensive check in case GitHub rate-limits the user's IP
        if (Array.isArray(data)) {
          setContributors(data);
        }
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const owner = contributors.find((c) => c.login === "KishonShrill");
  const maintainers = contributors.filter(
    (c) => c.login !== "KishonShrill" && c.type === "User",
  );
  const volunteers = communityVolunteers as CommunityVolunteer[];

  return (
    <div className="mx-auto max-w-[1000px] space-y-16 px-4 py-12 md:px-6">
      {/* --- LOADING STATE --- */}
      {isLoading && (
        <div className="flex w-full flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin" />
          <p className="animate-pulse font-medium">
            Loading GitHub contributors...
          </p>
        </div>
      )}

      {/* --- SECTION 1: THE OWNER/LEAD --- */}
      {!isLoading && owner && (
        <section className="animate-in fade-in space-y-6 duration-500">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Project Lead</h2>
          </div>

          <div className="flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
            <Image
              src={`${owner.avatar_url}&s=128`}
              alt={owner.login}
              width={128}
              height={128}
              unoptimized
              loading="lazy"
              className="h-24 w-24 rounded-full border-4 border-slate-50 shadow-md sm:h-32 sm:w-32"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-slate-900">
                {owner.login}
              </h3>
              <p className="mb-4 font-medium text-slate-500">
                Founder & Lead Developer
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {owner.contributions} Contribution
                  {owner.contributions !== 1 ? "s" : ""}
                </span>
                <a
                  href={owner.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600"
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 2: GITHUB MAINTAINERS --- */}
      {!isLoading && (
        <section className="animate-in fade-in space-y-6 delay-100 duration-500">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <Github className="h-6 w-6 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">
              Code Contributors
            </h2>
          </div>

          {maintainers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {maintainers.map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <Github className="absolute top-4 right-4 h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                  <Image
                    src={`${contributor.avatar_url}&s=128`}
                    alt={contributor.login}
                    width={128}
                    height={128}
                    loading="lazy"
                    unoptimized
                    className="mb-3 h-18 w-18 rounded-full shadow-sm transition-all group-hover:ring-2 group-hover:ring-blue-100"
                  />
                  <h3 className="line-clamp-1 font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {contributor.login}
                  </h3>
                  <span className="mt-2 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
                    {contributor.contributions} Contribution
                    {contributor.contributions !== 1 ? "s" : ""}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Github className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                No contributors to show right now
              </h3>
              <p className="mx-auto max-w-md text-slate-500">
                We couldn&apos;t load the contributor list from GitHub. Check
                back shortly, or view the project directly on GitHub.
              </p>
            </div>
          )}
        </section>
      )}

      {/* --- SECTION 3: COMMUNITY VOLUNTEERS (STATIC JSON) --- */}
      {/* Renders instantly, independent of GitHub loading */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-slate-900">
              Community Volunteers
            </h2>
          </div>
          <Link
            href="/volunteer"
            className="hidden text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 sm:block"
          >
            Become a volunteer &rarr;
          </Link>
        </div>

        {volunteers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {volunteers.map((volunteer, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {volunteer.profile_pic ? (
                  <Image
                    src={volunteer.profile_pic}
                    alt={volunteer.name}
                    width={56}
                    height={56}
                    unoptimized // Good practice for external links to save CPU
                    className="h-14 w-14 shrink-0 rounded-full bg-slate-100 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="line-clamp-1 font-bold text-slate-900">
                    {volunteer.name}
                  </h3>
                  <span className="mt-1.5 line-clamp-1 inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
                    {volunteer.profession}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              Be the first to join!
            </h3>
            <p className="mx-auto mb-6 max-w-md text-slate-500">
              We currently have no public community volunteers listed. Whether
              you are a government worker, teacher, or everyday citizen, we need
              your help.
            </p>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-slate-800"
            >
              Join as a Volunteer
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
