import type { Metadata } from "next";
import { kapwaSans, kapwaMono } from "./fonts";
import "./globals.css";

import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
    title: {
        default: 'BetterIligan City',
        template: '%s | BetterIligan City'
    },
    description: 'A modernized, volunteer-driven portal to access government services, public data, and resources for the people of Iligan.',
    openGraph: {
        title: 'BetterIligan City',
        description: 'A modernized, volunteer-driven portal to access government services...',
        url: 'https://betteriligancity.org',
        siteName: 'BetterIligan',
        images: [
            {
                url: '/og-banner.jpg', // Points to public/og-banner.jpg
                width: 1200,
                height: 630,
                alt: 'BetterIligan City Preview Banner',
            },
        ],
        locale: 'en_PH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BetterIligan City',
        description: 'A modernized, volunteer-driven portal to access government services...',
        images: ['/og-banner.jpg'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${kapwaSans.variable} ${kapwaMono.variable} scroll-smooth h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <TopBanner />
                <Header />
                <ScrollToTop />
                <div className="flex-grow flex flex-col">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
