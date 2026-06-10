import * as z from "zod";

// 1. Define the reusable sub-schemas
const RequirementSchema = z.object({
    groupName: z.string(),
    items: z.array(z.string())
});

const ProcedureSchema = z.object({
    stepNumber: z.number(),
    clientAction: z.string(),
    providerAction: z.string(),
    duration: z.string(),
    personInCharge: z.string(),
    fee: z.string()
});

// 2. Define the base fields that EVERY service must have
const BaseServiceSchema = z.object({
    slug: z.string(),
    title: z.string(),
    category: z.string(),
    description: z.string(),
    isWalkIn: z.boolean(),
    isOnline: z.boolean(),
    department: z.string(),
    schedule: z.string(),
    whoMayAvail: z.string(),
});

// 3. Define the "Official" shape
const OfficialServiceSchema = BaseServiceSchema.extend({
    source: z.literal("official"),
    requirements: z.array(RequirementSchema),
    procedures: z.array(ProcedureSchema),
});

// 4. Define the "External" shape
// Notice it does NOT have description, requirements, or procedures.
// (I added an externalUrl here, as you'll likely need a place to send the user!)
const ExternalServiceSchema = BaseServiceSchema.extend({
    source: z.literal("external"),
    externalUrl: z.string().url(),
});

// 5. Combine them using a Discriminated Union
export const ServiceSchema = z.discriminatedUnion("source", [
    OfficialServiceSchema,
    ExternalServiceSchema
]);

// 6. Export a schema for an array of these services
export const ServicesArraySchema = z.array(ServiceSchema);

// 7. Infer the TypeScript types automatically so you don't have to write them twice!
export type OfficialService = z.infer<typeof OfficialServiceSchema>;
export type ExternalService = z.infer<typeof ExternalServiceSchema>;
export type GovernmentService = z.infer<typeof ServiceSchema>;
