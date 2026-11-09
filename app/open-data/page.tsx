import { Metadata } from "next";

import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import { ShieldAlert, Database, FileJson, Info } from "lucide-react";
import ApiEndpointCard from "@/components/open-data/ApiEndpointCard";
import DatasetCard from "@/components/open-data/DatasetCard";
import CodePreview from "@/components/open-data/CodePreview";

export const metadata: Metadata = {
  title: "Open Data Portal",
  description:
    "Access Iligan City's open data through REST APIs and downloadable datasets. Free structured data for developers, researchers, and civic innovators.",
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
        <SubpageHero.Title>Open Data Portal</SubpageHero.Title>
        <SubpageHero.Description>
          Access Iligan City&apos;s public information through REST APIs and
          downloadable datasets. All data is free to use, with no API keys or
          rate limits.
        </SubpageHero.Description>
      </SubpageHero>

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        {/* Anti-Scraping Notice */}
        <div className="mb-12 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
          <div>
            <h3 className="mb-1 text-sm font-bold tracking-wider text-blue-900 uppercase">
              Please Do Not Scrape Our HTML
            </h3>
            <p className="text-sm leading-relaxed text-blue-800">
              To keep our servers fast and reliable for Iligan&apos;s citizens,
              please <strong>do not</strong> write web scrapers. Use the
              officially supported APIs and datasets documented below instead.
            </p>
          </div>
        </div>

        {/* Quick Start Info */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">REST APIs</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Server-processed endpoints that return validated, structured JSON.
              Perfect for live integrations and applications that need
              up-to-date data.
            </p>
            <div className="mt-3 text-xs text-slate-500">
              <strong>No authentication required</strong> • No rate limits •
              Cached responses
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileJson className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-slate-900">Static Datasets</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Direct JSON/GeoJSON file downloads for offline analysis, mapping,
              and research. Download once and use anywhere.
            </p>
            <div className="mt-3 text-xs text-slate-500">
              <strong>Public domain</strong> • One-time download • No server
              required
            </div>
          </div>
        </div>

        {/* REST APIs Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">REST APIs</h2>
              <p className="text-sm text-slate-600">
                Live endpoints returning validated, server-processed data
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <ApiEndpointCard
              name="Public Services Directory"
              endpoint="/api/v1/services"
              description="Complete directory of civic services, utilities, and emergency contacts. Includes walk-in and online service information."
              category="Government"
            />
            <ApiEndpointCard
              name="City Hall Departments"
              endpoint="/api/v1/departments"
              description="Local Government Unit (LGU) offices and departments managed by the City of Iligan."
              category="Government"
            />
            <ApiEndpointCard
              name="National Agencies & GOCCs"
              endpoint="/api/v1/agencies"
              description="Regional branches of national government entities and government-owned corporations operating in Iligan."
              category="Government"
            />
            <ApiEndpointCard
              name="Budget & Finances"
              endpoint="/api/v1/budget"
              description="Iligan City's annual revenue and expenditure breakdown, sourced from BLGF's Statement of Receipts and Expenditures."
              category="Transparency"
            />
          </div>

          {/* API Documentation */}
          <div className="space-y-4">
            <CodePreview
              title="Example: Fetch Services (JavaScript)"
              code={`fetch('https://betteriligancity.org/api/v1/services')
  .then(response => response.json())
  .then(data => {
    console.log(\`Found \${data.meta.total} services\`);
    console.log(data.data); // Array of service objects
  });`}
            />
            <CodePreview
              title="Example: Fetch Services (cURL)"
              code={`curl -X GET "https://betteriligancity.org/api/v1/services" \\
  -H "Accept: application/json"`}
            />
            <CodePreview
              title="Response Format"
              code={`{
  "success": true,
  "meta": {
    "total": 142,
    "lastUpdated": "2026-11-09T12:00:00Z",
    "source": "BetterIliganCity Open Data API",
    "description": "..."
  },
  "data": [
    {
      "title": "City Health Office",
      "category": "Health & Medical",
      "description": "Primary healthcare services...",
      "department": "Local Government Unit",
      "isWalkIn": true,
      "isOnline": false,
      "type": "standard",
      "slug": "city-health-office"
    }
    // ... more records
  ]
}`}
            />
          </div>
        </section>

        {/* Static Datasets Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-green-100 p-2 text-green-600">
              <FileJson className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Static Datasets
              </h2>
              <p className="text-sm text-slate-600">
                Downloadable JSON and GeoJSON files for offline use
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DatasetCard
              name="Jeepney Fares"
              path="/data/travel/jeepney-fare.json"
              description="Route codes, names, colors, and fare information for Iligan City's jeepney network."
              category="Transportation"
              format="JSON"
              estimatedRecords={30}
              size="4.2 KB"
            />
            <DatasetCard
              name="Jeepney Routes (GeoJSON)"
              path="/data/travel/jeepney-routes.json"
              description="Complete geographic routes as line geometries. Use with mapping libraries like Leaflet or Mapbox."
              category="Transportation"
              format="GeoJSON"
              estimatedRecords={25}
              size="1.2 MB"
            />
            <DatasetCard
              name="Bus Fares"
              path="/data/travel/bus-fares.json"
              description="Inter-city bus fare matrix with regular and discounted rates based on LTFRB regulations."
              category="Transportation"
              format="JSON"
              estimatedRecords={80}
              size="15 KB"
            />
            <DatasetCard
              name="Emergency Hotlines"
              path="/data/disaster/hotlines.json"
              description="Emergency contact numbers by category: police, fire, medical, rescue, utilities, and government."
              category="Disaster"
              format="JSON"
              estimatedRecords={9}
              size="2.1 KB"
            />
            <DatasetCard
              name="Disaster Facilities"
              path="/data/disaster/facilities.json"
              description="Evacuation centers, hospitals, barangay halls, and emergency facilities with coordinates and contact information."
              category="Disaster"
              format="JSON"
              estimatedRecords={50}
              size="12 KB"
            />
            <DatasetCard
              name="Waterfalls"
              path="/data/travel/waterfalls.json"
              description="Tourist waterfall locations with coordinates, descriptions, heights, and photo credits."
              category="Tourism"
              format="JSON"
              estimatedRecords={24}
              size="6.8 KB"
            />
            <DatasetCard
              name="Iligan City Boundary"
              path="/data/travel/iligan-city-boundary.json"
              description="City administrative boundary as a GeoJSON polygon for mapping and spatial analysis."
              category="Geography"
              format="GeoJSON"
              estimatedRecords={1}
              size="180 KB"
            />
          </div>
        </section>

        {/* Additional Information */}
        <section>
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">
                License & Attribution
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                All data provided through this portal is released under{" "}
                <strong>open access terms</strong> for public use. We believe
                public information belongs to the public.
              </p>
              <p>
                <strong>Attribution:</strong> While not required, we appreciate
                attribution to <code>BetterIliganCity.org</code> when using this
                data in publications, apps, or research.
              </p>
              <p>
                <strong>Data Sources:</strong> Information is compiled from
                official government sources, verified community contributions,
                and OpenStreetMap. Last updated: November 2026.
              </p>
              <p>
                <strong>Corrections:</strong> Found an error or have updated
                information? Use the &quot;Report an Issue&quot; button on the
                homepage or contribute directly on our{" "}
                <a
                  href="https://github.com/KishonShrill/betteriligan"
                  className="text-blue-600 underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
