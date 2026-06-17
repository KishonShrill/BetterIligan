import { NextResponse } from 'next/server';
// Adjust this import path to where your allDepartments variable is exported
import { allDepartments } from '@/data/government/departments';

export async function GET() {
    return NextResponse.json({
        success: true,
        meta: {
            total: allDepartments.length,
            lastUpdated: new Date().toISOString(),
            source: "BetterIliganCity Open Data API",
            description: "Local Government Unit (LGU) departments and offices inside Iligan City Hall."
        },
        data: allDepartments
    }, {
        status: 200,
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
