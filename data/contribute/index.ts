import rawTopics from "./topics.json";
import { ContributionDataSchema } from "@/validations/contributeSchema";
import type { ContributionData } from "@/validations/contributeSchema";

// Validate the JSON data at import time
const validatedData = ContributionDataSchema.parse(rawTopics);

export const contributionData: ContributionData = validatedData;
export const topics = validatedData.topics;
