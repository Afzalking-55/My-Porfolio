/* ============================================================
 * Authentication — Node runtime side (route handlers, server
 * components). The password lives ONLY in the
 * PRIVATE_AREA_PASSWORD env var and is never sent to the client.
 * ============================================================ */

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken, verifySessionToken } from "@/lib/session";

export { SESSION_COOKIE, createSessionToken };

/** Server Components / route handlers: is this request authenticated? */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function privateAreaConfigured(): boolean {
  return Boolean(process.env.PRIVATE_AREA_PASSWORD?.trim());
}

/**
 * Timing-safe password check. Both sides are SHA-256 hashed first so the
 * comparison length never leaks the password's length.
 */
export function checkPassword(candidate: string): boolean {
  const expected = process.env.PRIVATE_AREA_PASSWORD;
  if (!expected) return false; // private area disabled until configured
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function buildSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true, // unreadable by browser JS → mitigates token theft via XSS
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production
    sameSite: "lax" as const, // blocks cross-site form posts
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function buildClearCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
