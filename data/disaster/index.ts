// SERVER-ONLY MODULE — parse happens at build/render time on the server.
// Do NOT import this from any 'use client' file: that would bundle the full
// JSON payload plus zod into the browser build (data/services/index.ts has
// this problem via the client components that import it).
import {
  HotlinesArraySchema,
  GuidesArraySchema,
  FacilitiesArraySchema,
} from "@/validations/disasterSchema";
import rawHotlines from "./hotlines.json";
import rawGuides from "./guides.json";
import rawFacilities from "./facilities.json";

export const disasterHotlines = HotlinesArraySchema.parse(rawHotlines);
export const disasterGuides = GuidesArraySchema.parse(rawGuides);
export const disasterFacilities = FacilitiesArraySchema.parse(rawFacilities);
