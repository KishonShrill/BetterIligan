import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import path from "node:path";

export default defineConfig({
    plugins: [
        vinext({
            cache: { data: kvDataAdapter(), cdn: cdnAdapter() },
            images: { optimizer: imagesOptimizer() },
        }),
        cloudflare({
            viteEnvironment: {
                name: "rsc",
                childEnvironments: ["ssr"],
            },
        }),
    ],
    resolve: {
        alias: {
            "satori": path.resolve(import.meta.dirname, "empty-stub.js"),
            "sharp": path.resolve(import.meta.dirname, "empty-stub.js"),
        },
    },
    optimizeDeps: {
        exclude: ['maplibre-gl'],
    },
});
