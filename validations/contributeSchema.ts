import * as z from "zod";

// Media type for images
export const MediaImageSchema = z.object({
  type: z.literal("image"),
  src: z.string(),
  alt: z.string(),
});

// Media type for YouTube videos
export const MediaYouTubeSchema = z.object({
  type: z.literal("youtube"),
  src: z.string(), // YouTube video ID
});

// Union of all media types
export const MediaSchema = z.union([MediaImageSchema, MediaYouTubeSchema]);

// A single step within a contribution topic
export const StepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  media: MediaSchema.nullable(),
});

// A contribution topic (e.g., Jeepney Routes, Waterfalls)
export const TopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(StepSchema).min(1),
});

// Top-level schema for contribution data
export const ContributionDataSchema = z.object({
  topics: z.array(TopicSchema).min(1),
});

// Exported types
export type MediaImage = z.infer<typeof MediaImageSchema>;
export type MediaYouTube = z.infer<typeof MediaYouTubeSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type ContributionData = z.infer<typeof ContributionDataSchema>;
