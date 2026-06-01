import type { Metadata } from "next";
import { kapwaSans, kapwaMono } from "./fonts";
import "./globals.css";

import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "BetterIligan | Better Iligan City Website",
    description: "Access ",
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
                <Header />
                {children}
            </body>
        </html>
    );
}
