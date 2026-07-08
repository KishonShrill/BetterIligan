import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Returns the Bangon Iligan D1 database (the `DB` binding from wrangler.jsonc).
 *
 * Uses the async form of getCloudflareContext so it is safe to call from
 * statically-analysed server components as well as dynamic server actions and
 * route handlers. Throws immediately if the binding is missing (misconfigured
 * wrangler, or a build without the D1 database attached) instead of surfacing
 * an opaque failure deeper in a query.
 */
export async function getDb(): Promise<D1Database> {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.DB;
    if (!db) {
        throw new Error(
            'D1 binding "DB" is not available. Ensure wrangler.jsonc defines the ' +
                "d1_databases[DB] binding and that migrations have been applied.",
        );
    }
    return db;
}
