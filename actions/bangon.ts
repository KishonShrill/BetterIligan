"use server";

import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import {
  BoardMessageInputSchema,
  IncidentReportInputSchema,
} from "@/validations/bangonSchema";

type ActionResult = { success: true } | { success: false; error: string };

// In-memory IP rate limiter — mirrors actions/contribute.ts. Resets when the
// Worker instance spins down, but stops rapid-fire loops within a live one.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string, max: number, windowMs: number): boolean {
  if (ip === "unknown") return true;
  const now = Date.now();
  const status = rateLimitMap.get(ip) ?? { count: 0, timestamp: now };
  if (now - status.timestamp > windowMs) {
    status.count = 1;
    status.timestamp = now;
  } else {
    status.count++;
  }
  rateLimitMap.set(ip, status);
  return status.count <= max;
}

// Verifies the reCAPTCHA token — but only when a secret key is configured, so
// local dev works without one (same pragmatic stance as actions/contribute.ts).
// Returns false only on an actual verification failure.
async function verifyCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.append("remoteip", ip);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return false;
  }
}

async function clientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function firstError(fieldErrors: Record<string, string[] | undefined>): string {
  for (const messages of Object.values(fieldErrors)) {
    if (messages?.length) return messages[0];
  }
  return "Please check your entries and try again.";
}

// Posts a message to the public community board. Lands as 'pending' — an admin
// approves it before it shows publicly.
export async function postBoardMessage(
  formData: FormData,
  captchaToken: string,
): Promise<ActionResult> {
  try {
    const ip = await clientIp();
    if (!rateLimit(ip, 3, 60_000)) {
      return {
        success: false,
        error: "You are posting too fast. Please wait a minute.",
      };
    }

    const parsed = BoardMessageInputSchema.safeParse({
      message: formData.get("message"),
      authorName: formData.get("authorName"),
      barangay: formData.get("barangay"),
    });
    if (!parsed.success) {
      return {
        success: false,
        error: firstError(parsed.error.flatten().fieldErrors),
      };
    }

    if (!(await verifyCaptcha(captchaToken, ip))) {
      return { success: false, error: "CAPTCHA verification failed." };
    }

    const { message, authorName, barangay } = parsed.data;
    const db = await getDb();
    await db
      .prepare(
        "INSERT INTO bangon_board_messages (id, message, author_name, barangay) VALUES (?1, ?2, ?3, ?4)",
      )
      .bind(crypto.randomUUID(), message, authorName ?? null, barangay ?? null)
      .run();

    return { success: true };
  } catch (err) {
    console.error("postBoardMessage failed:", err);
    return { success: false, error: "Failed to post. Please try again later." };
  }
}

// Reports a standing hazard (flood-prone spot, broken siren, blocked waterway…).
// Stored as an unverified bangon_incidents row for admin review.
export async function submitHazardReport(
  formData: FormData,
  captchaToken: string,
): Promise<ActionResult> {
  try {
    const ip = await clientIp();
    if (!rateLimit(ip, 3, 60_000)) {
      return {
        success: false,
        error: "You are submitting too fast. Please wait a minute.",
      };
    }

    const parsed = IncidentReportInputSchema.safeParse({
      incidentType: formData.get("incidentType"),
      barangay: formData.get("barangay"),
      landmark: formData.get("landmark"),
      description: formData.get("description"),
      contactNumber: formData.get("contactNumber"),
    });
    if (!parsed.success) {
      return {
        success: false,
        error: firstError(parsed.error.flatten().fieldErrors),
      };
    }

    if (!(await verifyCaptcha(captchaToken, ip))) {
      return { success: false, error: "CAPTCHA verification failed." };
    }

    const { incidentType, barangay, landmark, description, contactNumber } =
      parsed.data;
    const db = await getDb();
    await db
      .prepare(
        "INSERT INTO bangon_incidents (id, incident_type, barangay, landmark, description, contact_number) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
      )
      .bind(
        crypto.randomUUID(),
        incidentType,
        barangay,
        landmark ?? null,
        description,
        contactNumber,
      )
      .run();

    return { success: true };
  } catch (err) {
    console.error("submitHazardReport failed:", err);
    return {
      success: false,
      error: "Failed to submit. Please try again later.",
    };
  }
}
