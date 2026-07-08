// SERVER-ONLY MODULE — parses the Bangon Iligan page config at build/render
// time. Do NOT import from a 'use client' file (it would bundle zod + the JSON
// into the browser). Mirrors data/disaster/index.ts.
import { BangonConfigSchema } from "@/validations/bangonSchema";
import rawConfig from "./incident.json";

export const bangonConfig = BangonConfigSchema.parse(rawConfig);
