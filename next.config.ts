import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;

// Only load the Cloudflare dev platform if we are locally developing
// AND we are strictly NOT running inside a Vercel environment.
if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    import("@opennextjs/cloudflare").then((m) =>
        m.initOpenNextCloudflareForDev()
    ).catch(console.error);
}
