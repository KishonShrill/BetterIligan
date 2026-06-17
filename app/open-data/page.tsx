import { Metadata } from 'next';

import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import { Code, Terminal, Database, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Open Data API | BetterIliganCity',
    description: 'Documentation for the BetterIliganCity Open Data API. Access our directory of local government units, services, and public facilities.',
};

export default function OpenDataPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/' text='Go Home' />
            <SubpageHero>
                <SubpageHero.Badges>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                        For Developers & Researchers
                    </span>
                </SubpageHero.Badges>
                <SubpageHero.Title>Open Data API</SubpageHero.Title>
                <SubpageHero.Description>
                    We believe public information belongs to the public. Access our directory of Iligan City services, contact details, and facilities through our free, structured JSON API.
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-12">

                {/* Anti-Scraping Notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">
                            Please Do Not Scrape Our HTML
                        </h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            To ensure our servers remain fast and reliable for the citizens of Iligan, we kindly ask developers and researchers <strong>not</strong> to write web scrapers for our user interface. Please use the officially supported API endpoint documented below instead.
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Endpoint Details */}
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                                <Database className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Available Endpoints</h2>
                        </div>

                        <p className="text-slate-600 mb-6">
                            We currently offer three separate REST endpoints to keep data payloads small and highly targeted. All endpoints accept standard <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">GET</code> requests and return JSON.
                        </p>

                        <div className="space-y-4">
                            {/* 1. Services */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-slate-900 rounded-xl p-4">
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-1">1. Public Services Directory</p>
                                    <p className="text-slate-400 text-xs">Returns civic services, utilities, and emergency contacts.</p>
                                </div>
                                <code className="text-emerald-400 font-mono text-sm whitespace-nowrap bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                                    /api/v1/services
                                </code>
                            </div>

                            {/* 2. Local Departments */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-slate-900 rounded-xl p-4">
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-1">2. City Hall Departments</p>
                                    <p className="text-slate-400 text-xs">Returns LGU offices managed directly by the City of Iligan.</p>
                                </div>
                                <code className="text-emerald-400 font-mono text-sm whitespace-nowrap bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                                    /api/v1/departments
                                </code>
                            </div>

                            {/* 3. National Agencies */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-slate-900 rounded-xl p-4">
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-1">3. National Agencies & GOCCs</p>
                                    <p className="text-slate-400 text-xs">Returns regional branches of national government entities.</p>
                                </div>
                                <code className="text-emerald-400 font-mono text-sm whitespace-nowrap bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                                    /api/v1/agencies
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Code Examples */}
                    <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-slate-400" /> Example Requests
                        </h3>

                        <div className="space-y-6">
                            {/* Fetch Example */}
                            <div>
                                <p className="text-sm font-semibold text-slate-500 mb-2">JavaScript (Fetch API)</p>
                                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar">
                                    {`fetch('https://betteriligancity.org/api/v1/services')
  .then(response => response.json())
  .then(data => console.log(data));`}
                                </pre>
                            </div>

                            {/* cURL Example */}
                            <div>
                                <p className="text-sm font-semibold text-slate-500 mb-2">cURL</p>
                                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar">
                                    {`curl -X GET "https://betteriligancity.org/api/v1/services" \\
  -H "Accept: application/json"`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Response Format */}
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Code className="w-5 h-5 text-slate-400" /> Response Schema
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm">
                            The API returns a JSON object containing metadata and a <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">data</code> array containing the service objects.
                        </p>
                        <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar">
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
