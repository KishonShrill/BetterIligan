import * as z from "zod";

// Bangon Iligan — schemas for the live command-center datastore.
//
// Two layers per entity:
//   *InputSchema  validates untrusted public form submissions (server actions).
//   *RowSchema    validates rows read back from D1 before they reach the UI,
//                 mirroring the repo's "parse at the boundary" convention.
//
// The closed value sets below MUST stay in sync with the CHECK constraints in
// migrations/0001_bangon.sql.

// A Philippine contact number: mobile (09xx / +639xx) or landline. Kept lenient
// on formatting (spaces, dashes, parens allowed) but must carry 7–13 digits so
// blank or junk input is rejected.
const PhoneSchema = z
  .string()
  .trim()
  .min(7, "Contact number is too short")
  .max(20, "Contact number is too long")
  .refine(
    (v) => v.replace(/\D/g, "").length >= 7,
    "Enter a valid contact number",
  );

// Optional free-text landmark; an empty string collapses to undefined so the
// column stays NULL rather than "".
const OptionalLandmarkSchema = z
  .string()
  .trim()
  .max(200, "Landmark is too long")
  .optional()
  .transform((v) => (v ? v : undefined));

const BarangaySchema = z
  .string()
  .trim()
  .min(2, "Barangay is required")
  .max(100, "Barangay name is too long");

// ── Relief requests ─────────────────────────────────────────────────
export const NeedTypeSchema = z.enum([
  "food",
  "water",
  "medicine",
  "shelter",
  "rescue",
]);
export const RequestStatusSchema = z.enum([
  "pending",
  "acknowledged",
  "fulfilled",
]);

export const ReliefRequestInputSchema = z.object({
  needType: NeedTypeSchema,
  barangay: BarangaySchema,
  landmark: OptionalLandmarkSchema,
  fullName: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(120, "Name is too long"),
  contactNumber: PhoneSchema,
});

export const ReliefRequestRowSchema = z.object({
  id: z.string(),
  need_type: NeedTypeSchema,
  barangay: z.string(),
  landmark: z.string().nullable(),
  full_name: z.string(),
  contact_number: z.string(),
  status: RequestStatusSchema,
  verified: z.union([z.literal(0), z.literal(1)]),
  created_at: z.string(),
  updated_at: z.string(),
});

// ── Incident reports ────────────────────────────────────────────────
export const IncidentTypeSchema = z.enum([
  "natural_disaster",
  "fire",
  "medical",
  "security",
  "infrastructure",
  "other",
]);
export const IncidentStatusSchema = z.enum([
  "open",
  "reviewing",
  "resolved",
  "dismissed",
]);

export const IncidentReportInputSchema = z.object({
  incidentType: IncidentTypeSchema,
  barangay: BarangaySchema,
  landmark: OptionalLandmarkSchema,
  description: z
    .string()
    .trim()
    .min(5, "Description is too short")
    .max(1000, "Description is too long"),
  contactNumber: PhoneSchema,
  // Photo uploads need R2 and are deferred; the column exists so the schema
  // is forward-compatible when uploads land.
  photoUrl: z.string().url().optional(),
});

export const IncidentReportRowSchema = z.object({
  id: z.string(),
  incident_type: IncidentTypeSchema,
  barangay: z.string(),
  landmark: z.string().nullable(),
  description: z.string(),
  photo_url: z.string().nullable(),
  contact_number: z.string(),
  status: IncidentStatusSchema,
  verified: z.union([z.literal(0), z.literal(1)]),
  created_at: z.string(),
  updated_at: z.string(),
});

// ── Public community board ──────────────────────────────────────────
export const BoardStatusSchema = z.enum(["pending", "approved", "hidden"]);

export const BoardMessageInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, "Message is too short")
    .max(280, "Message is too long"),
  // Optional attribution; empty strings collapse to undefined (NULL column).
  authorName: z
    .string()
    .trim()
    .max(80, "Name is too long")
    .optional()
    .transform((v) => (v ? v : undefined)),
  barangay: z
    .string()
    .trim()
    .max(100, "Barangay name is too long")
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export const BoardMessageRowSchema = z.object({
  id: z.string(),
  message: z.string(),
  author_name: z.string().nullable(),
  barangay: z.string().nullable(),
  status: BoardStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

// ── Ingested feed (official sources) ────────────────────────────────
// Normalized output of a feed adapter (see lib/bangon/feeds.ts).
export const FeedItemSchema = z.object({
  source: z.string().min(1),
  externalId: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1).max(300),
  summary: z.string().max(1000).optional(),
  url: z.string().url().optional(),
  magnitude: z.number().optional(),
  publishedAt: z.string().min(1),
});

export const FeedRowSchema = z.object({
  id: z.string(),
  source: z.string(),
  external_id: z.string(),
  category: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  url: z.string().nullable(),
  magnitude: z.number().nullable(),
  published_at: z.string(),
  created_at: z.string(),
});

// ── Page configuration (data/bangon/incident.json) ──────────────────
// Drives the standby↔active switch. When `active` is false the page renders a
// preparedness/standby surface and the activeIncident + donation blocks stay
// hidden — which is why their TODO placeholders never reach the public UI.
export const BangonConfigSchema = z.object({
  active: z.boolean(),
  standby: z.object({
    headline: z.string(),
    message: z.string(),
    preparednessHref: z.string(),
  }),
  boardEnabled: z.boolean(),
  hazardReportsEnabled: z.boolean(),
  activeIncident: z.object({
    title: z.string(),
    summary: z.string(),
    declaredAt: z.string(),
  }),
  displayDonation: z.boolean(),
  donation: z.object({
    gcash: z.object({ name: z.string(), number: z.string() }),
    bank: z.object({
      bank: z.string(),
      accountName: z.string(),
      accountNumber: z.string(),
    }),
    dropOff: z.array(z.object({ name: z.string(), address: z.string() })),
    inKindNeeds: z.array(z.string()),
  }),
});

// ── Runtime incident-activation state (bangon_incident_state) ────────
// A single-row table (id = 'current') that overrides the committed JSON's
// `active` + `activeIncident` so a moderator can toggle it without a redeploy.
export const IncidentStateRowSchema = z.object({
  id: z.string(),
  active: z.union([z.literal(0), z.literal(1)]),
  title: z.string(),
  summary: z.string(),
  declared_at: z.string(),
  updated_at: z.string(),
});

// ── Inferred types ──────────────────────────────────────────────────
export type NeedType = z.infer<typeof NeedTypeSchema>;
export type RequestStatus = z.infer<typeof RequestStatusSchema>;
export type ReliefRequestInput = z.infer<typeof ReliefRequestInputSchema>;
export type ReliefRequestRow = z.infer<typeof ReliefRequestRowSchema>;

export type IncidentType = z.infer<typeof IncidentTypeSchema>;
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;
export type IncidentReportInput = z.infer<typeof IncidentReportInputSchema>;
export type IncidentReportRow = z.infer<typeof IncidentReportRowSchema>;

export type BoardStatus = z.infer<typeof BoardStatusSchema>;
export type BoardMessageInput = z.infer<typeof BoardMessageInputSchema>;
export type BoardMessageRow = z.infer<typeof BoardMessageRowSchema>;

export type BangonConfig = z.infer<typeof BangonConfigSchema>;

export type IncidentStateRow = z.infer<typeof IncidentStateRowSchema>;

export type FeedItem = z.infer<typeof FeedItemSchema>;
export type FeedRow = z.infer<typeof FeedRowSchema>;
