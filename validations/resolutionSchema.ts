import { z } from 'zod';

export const ResolutionCategorySchema = z.enum([
    'General Public Services',
    'Social Services',
    'Economic Services',
    'Debt Service',
]); // New string literals — not reused from validations/budgetSchema.ts, whose expenditure
    // fields are camelCase (generalPublicServices, etc.) with no matching enum. These display
    // strings just match the labels BudgetClient.tsx renders for that page's four categories,
    // so the two transparency pages read as one shared taxonomy without actually sharing code.

export const ResolutionSchema = z.object({
    number: z.string(),
    type: z.enum(['resolution', 'ordinance']),
    title: z.string(),
    summary: z.string(),
    category: ResolutionCategorySchema,
    sessionDate: z.string(),
    approvalDate: z.string().optional(),
    sourceUrl: z.string(),
});

export const ResolutionsSchema = z.object({
    years: z.array(z.number()),
    entries: z.array(ResolutionSchema),
});

export type Resolution = z.infer<typeof ResolutionSchema>;
export type ResolutionsData = z.infer<typeof ResolutionsSchema>;
