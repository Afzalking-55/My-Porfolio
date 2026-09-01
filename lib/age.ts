/* ============================================================
 * Age is computed — never stored. A date of birth that lives in
 * the private data store is turned into a current age at render
 * time, so it can never go stale or be hardcoded wrongly.
 * Client-safe: no server-only imports.
 * ============================================================ */

const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function leap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function validIsoDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1) return false;
  const max = mo === 2 && leap(y) ? 29 : MONTHS[mo - 1];
  return d <= max;
}

/** Find the first ISO date (YYYY-MM-DD) in free text, e.g. "Date of birth: <iso>". */
export function extractDob(text: string): string | null {
  const m = /\b(\d{4}-\d{2}-\d{2})\b/.exec(text);
  if (m && validIsoDate(m[1])) return m[1];
  return null;
}

/** Exact years lived as of `now` (local calendar math — no timezone drift). */
export function ageFromIso(iso: string, now: Date = new Date()): number | null {
  if (!validIsoDate(iso)) return null;
  const [y, mo, d] = iso.split("-").map(Number);
  let age = now.getFullYear() - y;
  const beforeBirthday =
    now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  if (age < 0 || age > 130) return null; // implausible → refuse to display
  return age;
}
