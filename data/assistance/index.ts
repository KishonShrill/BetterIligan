import { AssistanceArraySchema } from "@/validations/assistanceSchema";
import raw from "./programs.json";

// Validated at module load — a malformed entry fails the build (see the
// data-as-validated-JSON convention used across the repo).
export const assistancePrograms = AssistanceArraySchema.parse(raw);
