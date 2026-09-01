import { cookies } from "next/headers";

// Minimal shared-secret admin auth for the Bangon Iligan moderation surface.
// A single ADMIN_PASSWORD grants a signed, HttpOnly session cookie — no user
// accounts, no DB. Designed to be swapped for Cloudflare Access or real auth
// later without touching the moderation UI.
//
// Env:
//   ADMIN_PASSWORD        the moderator password (required in production)
//   ADMIN_SESSION_SECRET  HMAC key for the session cookie (falls back to
//                         ADMIN_PASSWORD, then a dev-only default)

const COOKIE_NAME = "bangon_admin";
const COOKIE_PATH = "/bangon-iligan";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

// In production these MUST come from the environment; the dev fallbacks keep
// local `next dev` usable without secrets but never apply in production.
function adminPassword(): string | undefined {
  return (
    process.env.ADMIN_PASSWORD ?? (isProd() ? undefined : "iligan-admin-dev")
  );
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    (isProd() ? "" : "bangon-dev-session-secret")
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Length-safe, constant-time-ish string comparison.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Validates the password and, on success, sets the signed session cookie.
export async function createAdminSession(password: string): Promise<boolean> {
  const expected = adminPassword();
  if (!expected || !safeEqual(password, expected)) return false;

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin:${exp}`;
  const token = `${exp}.${await sign(payload, sessionSecret())}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: COOKIE_PATH });
}

// True when the request carries a valid, unexpired admin session cookie.
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = await sign(`admin:${exp}`, sessionSecret());
  return safeEqual(sig, expected);
}
