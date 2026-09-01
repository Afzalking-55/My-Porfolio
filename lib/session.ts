/* ============================================================
 * Session token primitives — EDGE-SAFE (no node:crypto, no fs).
 * Imported by middleware.ts and by server route handlers.
 * ============================================================ */

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "rm_session";
const SESSION_DURATION_S = 60 * 60 * 24 * 7; // one week

export function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is missing or too short (min 32 chars). Set it in your environment — see .env.example."
    );
  }
  // Dev-only fallback so the site runs before you create a .env.local.
  // Sessions signed with this value are NOT secure — never ship it.
  return new TextEncoder().encode("dev-only-insecure-secret-do-not-ship-000000");
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ scope: "the-real-me" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_S}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    return payload.scope === "the-real-me";
  } catch {
    return false;
  }
}
