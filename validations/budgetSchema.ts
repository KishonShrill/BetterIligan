import { z } from 'zod';

export const BudgetYearSchema = z.object({
    fiscalYear: z.number().int(),
    status: z.enum(['final', 'preliminary']),
    income: z.object({
        localTax: z.number().nonnegative(),
        localNonTax: z.number().nonnegative(),
        nationalTaxAllotment: z.number().nonnegative(),
        otherExternal: z.number().nonnegative(),
        total: z.number().nonnegative(),
    }),
    expenditure: z.object({
        generalPublicServices: z.number().nonnegative(),
        socialServices: z.number().nonnegative(),
        economicServices: z.number().nonnegative(),
        debtService: z.number().nonnegative(),
        total: z.number().nonnegative(),
    }),
    capitalOutlay: z.number().nonnegative(),
    netOperatingSurplus: z.number(),
});

export const BudgetSchema = z.object({
    currency: z.literal('PHP'),
    unit: z.literal('million'),
    years: z.array(BudgetYearSchema),
});

export type BudgetYear = z.infer<typeof BudgetYearSchema>;
export type BudgetData = z.infer<typeof BudgetSchema>;
