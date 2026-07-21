import { ImageResponse } from 'next/og';
import { allServices } from '@/data/services'; // Assuming this is accessible from here
import { getCategoryStyles } from '@/lib/utils';

export const runtime = 'edge';
export const alt = 'BetterIliganCity Service';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';


export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // 1. Fetch the exact same data as your page.tsx
    const service = allServices.find((s) => 'slug' in s && s.slug === slug);

    // Fallback title if service isn't found
    const title = service ? service.title : 'Service Not Found';
    const category = service && 'category' in service ? service.category : 'General';
    const colors = getCategoryStyles(category);

    // 2. Return the dynamically generated image
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0038a8', // White background
                    padding: '60px 80px',
                    fontFamily: 'sans-serif',
                    color: 'white'
                }}
            >
                {/* Top row: Logo Placeholder and Category Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

                    {/* Logo Placeholder */}
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 'bold', color: 'white' }}>
                        <img src="https://betteriligancity.org/icon.png" alt='BetterIliganCity logo' style={{ width: '64px', height: '64px', marginRight: 16 }} />
                        BetterIliganCity
                    </div>

                    {/* Dynamic Category Pill */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {service && (
                            <div
                                style={{
                                    display: 'flex',
                                    padding: '8px 24px',
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    borderRadius: '9999px',
                                    fontSize: "2.5rem",
                                    fontWeight: 600,
                                }}
                            >
                                {category}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Title Section */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: '5rem',
                        fontWeight: 800,
                        color: 'white', // Black text
                        marginTop: 'auto',
                        marginBottom: '40px',
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </div>

                {/* Footer / Department Info */}
                <div style={{ display: 'flex', fontSize: "2rem", color: 'white', fontWeight: 500 }}>
                    {service ? `Provided by: ${service.type === "standard" ? service.department : 'N/A'}` : 'BetterIliganCity Portal'}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
