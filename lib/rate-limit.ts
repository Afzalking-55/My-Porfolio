/* ============================================================
 * In-memory rate limiter for the login endpoint.
 * Enough for a single-server deployment (VPS, Docker, Railway,
 * Render…). For multi-instance serverless deployments swap this
 * for Redis / Upstash — only this file needs to change.
 * ============================================================ */

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

const buckets = new Map<string, Bucket>();

export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  return Boolean(b && b.count >= MAX_ATTEMPTS && b.resetAt > now);
}

export function registerFailedAttempt(key: string): void {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    b.count += 1;
    // keep the map from growing forever
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
  }
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}

/** Best-effort client identifier from proxy headers. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : req.headers.get("x-real-ip") ?? "unknown";
  return ip || "unknown";
}
