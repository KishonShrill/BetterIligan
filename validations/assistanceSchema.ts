import * as z from "zod";

// A scholarship or assistance program available to Iligan residents. Because
// deadlines and amounts change every cycle, the durable fields (provider, who
// it's for, how to apply, official link) are required, while `timing` captures
// the point-in-time status and recurring cycle — always paired with `verifiedAt`
// and a "confirm on the official page" disclaimer in the UI.
export const AssistanceSchema = z.object({
  name: z.string(),
  provider: z.string(),
  scope: z.enum(["city", "national"]),
  category: z.enum(["scholarship", "financial-assistance", "training"]),
  forWho: z.string(),
  howToApply: z.string(),
  timing: z.string(),
  officialUrl: z.string().url(),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be YYYY-MM-DD"),
});

export const AssistanceArraySchema = z.array(AssistanceSchema).min(1);
export type AssistanceProgram = z.infer<typeof AssistanceSchema>;
