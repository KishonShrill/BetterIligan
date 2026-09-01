import * as z from "zod";

// A waterfall in the Iligan directory. Coordinates are community-sourced from
// OpenStreetMap (approximate); photos are Wikimedia Commons with per-image
// credit + license so the attribution bar is preserved.
export const WaterfallPhotoSchema = z.object({
  // Remote (Wikimedia) URL or a bundled local path under /public.
  url: z
    .string()
    .refine(
      (v) => v.startsWith("/") || v.startsWith("http"),
      "must be a URL or local path",
    ),
  credit: z.string(),
  license: z.string(),
  source: z.string().url(),
});

export const WaterfallSchema = z.object({
  name: z.string(),
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  area: z.string().optional(),
  height: z.string().optional(),
  description: z.string().optional(),
  photo: WaterfallPhotoSchema.optional(),
  reference: z.string().url().optional(),
  // OpenStreetMap element the coordinates came from (provenance).
  source: z.string().url().optional(),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be YYYY-MM-DD"),
});

export const WaterfallsArraySchema = z.array(WaterfallSchema).min(1);

export type Waterfall = z.infer<typeof WaterfallSchema>;
