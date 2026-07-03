import * as z from "zod";

// A single emergency contact. `source` + `verifiedAt` implement the spec's
// verification bar: no entry ships without provenance.
export const HotlineSchema = z.object({
    name: z.string(),
    category: z.enum(["medical", "fire", "police", "rescue", "utility", "government"]),
    numbers: z.array(z.string()).min(1),
    hours: z.string().optional(),
    source: z.string().url(),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be YYYY-MM-DD"),
});

export const HotlinesArraySchema = z.array(HotlineSchema).min(1);

// Before/during/after checklists for one hazard type.
export const GuideSchema = z.object({
    hazard: z.enum(["typhoon", "flood", "earthquake"]),
    phases: z.object({
        before: z.array(z.string()).min(1),
        during: z.array(z.string()).min(1),
        after: z.array(z.string()).min(1),
    }),
});

export const GuidesArraySchema = z.array(GuideSchema).min(1);

export type Hotline = z.infer<typeof HotlineSchema>;
export type DisasterGuide = z.infer<typeof GuideSchema>;
