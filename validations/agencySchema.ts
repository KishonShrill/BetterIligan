import * as z from "zod";

const Categories = z.enum(['National Agencies', 'GOCCs', 'Constitutional Commissions', 'LGU Offices', 'Programs & Associations'])

export const AgencySchema = z.object({
    name: z.string(),
    category: Categories,
    address: z.string(),
    websiteUrl: z.string().optional(),
    facebookUrl: z.string().optional(),
    logoUrl: z.string().optional(),
})

export const AgencyArraySchema = z.array(AgencySchema)

export type AgencyCategory = z.infer<typeof Categories>;
export type Agency = z.infer<typeof AgencySchema>;
