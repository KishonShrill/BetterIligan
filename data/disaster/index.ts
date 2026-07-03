// SERVER-ONLY MODULE — parse happens at build/render time on the server.
// Do NOT import this from any 'use client' file: it would ship the full
// JSON payload plus zod to the browser (see audit finding on data/services).
import { HotlinesArraySchema, GuidesArraySchema } from "@/validations/disasterSchema";
import rawHotlines from "./hotlines.json";
import rawGuides from "./guides.json";

export const disasterHotlines = HotlinesArraySchema.parse(rawHotlines);
export const disasterGuides = GuidesArraySchema.parse(rawGuides);
