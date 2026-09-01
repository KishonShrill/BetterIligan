import { Metadata } from "next";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { Code, Terminal, Database, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Open Data API",
  description:
    "Documentation for the BetterIliganCity Open Data API. Access our directory of local government units, services, and public facilities.",
};

export default function OpenDataPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text="Go Home" />
      <SubpageHero>
        <SubpageHero.Badges>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
            For Developers & Researchers
          </span>
        </SubpageHero.Badges>
        <SubpageHero.Title>Open Data API</SubpageHero.Title>
        <SubpageHero.Description>
          We believe public information belongs to the public. Access our
          directory of Iligan City services, contact details, and facilities
          through our free, structured JSON API.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[1000px] px-4 py-12 md:px-6">
        {/* Anti-Scraping Notice */}
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
          <div>
            <h3 className="mb-1 text-sm font-bold tracking-wider text-blue-900 uppercase">
              Please Do Not Scrape Our HTML
            </h3>
            <p className="text-sm leading-relaxed text-blue-800">
              To ensure our servers remain fast and reliable for the citizens of
              Iligan, we kindly ask developers and researchers{" "}
              <strong>not</strong> to write web scrapers for our user interface.
              Please use the officially supported API endpoint documented below
              instead.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Endpoint Details */}
          <div className="border-b border-slate-100 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Available Endpoints
              </h2>
            </div>

            <p className="mb-6 text-slate-600">
              We currently offer four separate REST endpoints to keep data
              payloads small and highly targeted. All endpoints accept standard{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">
                GET
              </code>{" "}
              requests and return JSON.
            </p>

            <div className="space-y-4">
              {/* 1. Services */}
              <div className="flex flex-col gap-3 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-white">
                    1. Public Services Directory
                  </p>
                  <p className="text-xs text-slate-400">
                    Returns civic services, utilities, and emergency contacts.
                  </p>
                </div>
                <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-sm whitespace-nowrap text-emerald-400">
                  /api/v1/services
                </code>
              </div>

              {/* 2. Local Departments */}
              <div className="flex flex-col gap-3 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-white">
                    2. City Hall Departments
                  </p>
                  <p className="text-xs text-slate-400">
                    Returns LGU offices managed directly by the City of Iligan.
                  </p>
                </div>
                <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-sm whitespace-nowrap text-emerald-400">
                  /api/v1/departments
                </code>
              </div>

              {/* 3. National Agencies */}
              <div className="flex flex-col gap-3 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-white">
                    3. National Agencies & GOCCs
                  </p>
                  <p className="text-xs text-slate-400">
                    Returns regional branches of national government entities.
                  </p>
                </div>
                <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-sm whitespace-nowrap text-emerald-400">
                  /api/v1/agencies
                </code>
              </div>

              {/* 4. Budget & Finances */}
              <div className="flex flex-col gap-3 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-white">
                    4. Budget & Finances
                  </p>
                  <p className="text-xs text-slate-400">
                    Returns Iligan City&apos;s annual revenue and expenditure
                    breakdown.
                  </p>
                </div>
                <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-sm whitespace-nowrap text-emerald-400">
                  /api/v1/budget
                </code>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <Terminal className="h-5 w-5 text-slate-400" /> Example Requests
            </h3>

            <div className="space-y-6">
              {/* Fetch Example */}
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-500">
                  JavaScript (Fetch API)
                </p>
                <pre className="custom-scrollbar overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-300">
                  {`fetch('https://betteriligancity.org/api/v1/services')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>

              {/* cURL Example */}
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-500">
                  cURL
                </p>
                <pre className="custom-scrollbar overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-300">
                  {`curl -X GET "https://betteriligancity.org/api/v1/services" \\
  -H "Accept: application/json"`}
                </pre>
              </div>
            </div>
          </div>

          {/* Response Format */}
          <div className="p-6 md:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <Code className="h-5 w-5 text-slate-400" /> Response Schema
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              The API returns a JSON object containing metadata and a{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">
                data
              </code>{" "}
              array containing the service objects.
            </p>
            <pre className="custom-scrollbar overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-emerald-400">
              {`{
  "success": true,
  "meta": {
    "total": 142,
    "lastUpdated": "2026-06-17T12:00:00Z",
    "source": "BetterIliganCity Open Data API"
  },
  "data": [
    {
      "title": "City Health Office",
      "category": "Health & Medical",
      "description": "Primary healthcare services and sanitary permits...",
      "department": "Local Government Unit",
      "isWalkIn": true,
      "isOnline": false,
      "type": "standard",
      "slug": "city-health-office"
    }
    // ... more results
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
