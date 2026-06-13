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
        locale: 'en_PH',
        type: 'website',
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
            className={`${kapwaSans.variable} ${kapwaMono.variable} h-full antialiased`}
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
