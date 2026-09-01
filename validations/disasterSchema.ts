import * as z from "zod";

// A single emergency contact. `source` + `verifiedAt` implement the spec's
// verification bar: no entry ships without provenance.
export const HotlineSchema = z.object({
  name: z.string(),
  category: z.enum([
    "medical",
    "fire",
    "police",
    "rescue",
    "utility",
    "government",
  ]),
  numbers: z.array(z.string()).min(1),
  hours: z.string().optional(),
  source: z.string().url(),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be YYYY-MM-DD"),
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

// A geolocated emergency facility for the map. `source` + `verifiedAt` carry the
// same provenance bar as hotlines; `lat`/`lon` are community-sourced from
// OpenStreetMap and are approximate — the UI labels them as such.
export const FacilitySchema = z.object({
  name: z.string(),
  category: z.enum([
    "evacuation",
    "medical",
    "fire",
    "police",
    "government",
    "utility",
    "barangay",
  ]),
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  address: z.string().optional(),
  tel: z.string().optional(),
  source: z.string().url(),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be YYYY-MM-DD"),
});

export const FacilitiesArraySchema = z.array(FacilitySchema).min(1);

export type Hotline = z.infer<typeof HotlineSchema>;
export type DisasterGuide = z.infer<typeof GuideSchema>;
export type DisasterFacility = z.infer<typeof FacilitySchema>;
