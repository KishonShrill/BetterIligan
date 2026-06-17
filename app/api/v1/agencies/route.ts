import { NextResponse } from 'next/server';
// Adjust this import path to where your allAgencies variable is exported
import { allAgencies } from '@/data/government';

export async function GET() {
    return NextResponse.json({
        success: true,
        meta: {
            total: allAgencies.length,
            lastUpdated: new Date().toISOString(),
            source: "BetterIliganCity Open Data API",
            description: "National government agencies, GOCCs, and regional offices in Iligan City."
        },
        data: allAgencies
    }, {
        status: 200,
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
