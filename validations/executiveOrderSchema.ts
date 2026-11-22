import { z } from "zod";

export const ExecutiveOrderSchema = z.object({
  archive_code: z.string(),
  title: z.string(),
  description: z.string(),
  publication_date: z.string(), // ISO format YYYY-MM-DD
});

export const ExecutiveOrdersSchema = z.object({
  years: z.array(z.number()),
  entries: z.array(ExecutiveOrderSchema),
});

export type ExecutiveOrder = z.infer<typeof ExecutiveOrderSchema>;
export type ExecutiveOrdersData = z.infer<typeof ExecutiveOrdersSchema>;
