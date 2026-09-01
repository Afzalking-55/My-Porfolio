/* ============================================================
 * SITE_URL — normalized, build-safe public base URL.
 *
 * Why this exists: `process.env.SITE_URL ?? fallback` does NOT catch
 * an EMPTY string (only null/undefined), and a configured-but-invalid
 * value (blank, missing scheme, garbage) made `new URL(siteUrl)` in
 * app/layout.tsx throw during static generation — which kills the
 * whole production build on Vercel ("Error occurred prerendering
 * page /_not-found"). Env vars are operator input, so treat them as
 * hostile config: use the value only when it is a valid http(s) URL,
 * otherwise behave as if it were not set.
 *
 * Pure string logic — edge-safe, no node imports.
 * ============================================================ */

const DEV_FALLBACK = "http://localhost:3000";

export function getSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return DEV_FALLBACK;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return DEV_FALLBACK;
  } catch {
    return DEV_FALLBACK; // malformed — not a valid absolute URL
  }
  return raw.replace(/\/+$/, ""); // no trailing slash, ever
}
