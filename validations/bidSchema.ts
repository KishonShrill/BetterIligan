import { z } from 'zod';

export const BidStageSchema = z.object({
    stage: z.enum(['ITB', 'NOA', 'NTP']),
    label: z.string(),
    pdfUrl: z.string(),
});

export const BidSchema = z.object({
    reference: z.string(),
    office: z.string(),
    title: z.string(),
    stages: z.array(BidStageSchema).min(1),
});

export const BidsSchema = z.object({
    entries: z.array(BidSchema),
});

export type BidStage = z.infer<typeof BidStageSchema>;
export type Bid = z.infer<typeof BidSchema>;
export type BidsData = z.infer<typeof BidsSchema>;

const STAGE_ORDER: BidStage['stage'][] = ['ITB', 'NOA', 'NTP'];

export function getBidStatus(stages: BidStage[]): 'Open for Bidding' | 'Awarded' | 'Ongoing' {
    const has = (s: BidStage['stage']) => stages.some((st) => st.stage === s);
    if (has('NTP')) return 'Ongoing';
    if (has('NOA')) return 'Awarded';
    return 'Open for Bidding';
}

export function sortStages(stages: BidStage[]): BidStage[] {
    return [...stages].sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage));
}
