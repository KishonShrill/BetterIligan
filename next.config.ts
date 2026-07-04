import type { NextConfig } from "next";

const LOCAL_IP = process.env.DEVELOPMENT_IP;

const securityHeaders = [
    {
        // Start with Report-Only to shake out violations before enforcing.
        // Switch to 'Content-Security-Policy' once the report stream is clean.
        key: 'Content-Security-Policy-Report-Only',
        value: [
            "default-src 'self'",
            // reCAPTCHA loads from google.com + gstatic.com; 'unsafe-inline' for JSON-LD and reCAPTCHA init
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
            // Google Fonts CSS + inline styles used by Next.js
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            // Broad https: covers GitHub avatars, Facebook CDN, CartoDB tiles, and any future image source
            "img-src 'self' data: blob: https:",
            // Google Fonts font files
            "font-src 'self' https://fonts.gstatic.com",
            // Google Maps embed, reCAPTCHA iframe, Facebook post embed
            "frame-src https://www.google.com https://www.recaptcha.net https://www.facebook.com",
            // Client-side fetches: weather API + currency API (server-only calls not listed)
            "connect-src 'self' https://api.open-meteo.com https://api.exchangerate-api.com",
            // Prevent the page from being embedded in any iframe
            "frame-ancestors 'none'",
        ].join('; '),
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self)',
    },
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
];

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: LOCAL_IP ? [LOCAL_IP] : [],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.fbcdn.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;

// Only load the Cloudflare dev platform if we are locally developing
// AND we are strictly NOT running inside a Vercel environment.
if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    import("@opennextjs/cloudflare").then((m) =>
        m.initOpenNextCloudflareForDev()
    ).catch(console.error);
}
