import { z } from 'zod';

// --- Shared Reusable Schemas ---
export const KeyValueRowSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export const GridStatSchema = z.object({
    label: z.string(),
    value: z.string(),
    subtext: z.string().optional(), // Optional since revenue/assets don't always have it
    href: z.string().optional(),
});

export const WonderStatSchema = z.object({
    label: z.string(),
    count: z.number(),
    bgColor: z.string(),
    textColor: z.string(),
    divColor: z.string(),
    borderColor: z.string(),
});

export const FacilityStatSchema = z.object({
    label: z.string(),
    value: z.string(),
    subtext: z.string(),
    icon: z.string(),
    href: z.string().optional()
});

export const QuickStatSchema = z.object({
    label: z.string(),
    value: z.string(),
    subtext: z.string(),
});

// --- Main Category Schemas ---
export const CityHeaderSchema = z.object({
    classification: z.string(),
    location: z.string(),
    foundedBadge: z.string(),
    name: z.string(),
    description: z.string(),
    highlight: z.string(),
    descriptionEnd: z.string(),
});

export const DemographicsDataSchema = z.object({
    grid: z.array(GridStatSchema),
    generalInfo: z.array(KeyValueRowSchema),
});

export const GovernmentDataSchema = z.object({
    local: z.array(KeyValueRowSchema),
    history: z.array(KeyValueRowSchema),
});

export const EconomyDataSchema = z.object({
    grid: z.array(GridStatSchema),
    commerce: z.array(KeyValueRowSchema),
});

export const EnvironmentDataSchema = z.object({
    wonders: z.array(WonderStatSchema),
    geography: z.array(KeyValueRowSchema),
});

export const InfrastructureDataSchema = z.object({
    facilities: z.array(FacilityStatSchema),
    communications: z.array(z.string()),
});

// --- The Root Schema ---
export const CityProfileSchema = z.object({
    header: CityHeaderSchema,
    quickStats: z.array(QuickStatSchema),
    demographics: DemographicsDataSchema,
    government: GovernmentDataSchema,
    economy: EconomyDataSchema,
    environment: EnvironmentDataSchema,
    infrastructure: InfrastructureDataSchema,
});

// --- Extract TypeScript Types ---
// This automatically generates standard TS interfaces from the Zod schemas above!
export type CityProfileData = z.infer<typeof CityProfileSchema>;
export type FacilityStat = z.infer<typeof FacilityStatSchema>;
export type KeyValueRow = z.infer<typeof KeyValueRowSchema>;
