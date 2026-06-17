import { NextResponse } from 'next/server';
// Import your already combined and validated static object!
import { allServices } from '@/data/services'; // Adjust this import path to wherever your combined array lives

export async function GET() {
    // We return the exact static object as a JSON response.
    // Next.js handles this incredibly efficiently.
    return NextResponse.json({
        success: true,
        meta: {
            total: allServices.length,
            lastUpdated: new Date().toISOString(), // Optional: gives developers a timestamp
            source: "BetterIliganCity Open Data API"
        },
        data: allServices
    }, {
        status: 200,
        // Optional: Add cache headers so it doesn't re-compute on every single API hit
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
