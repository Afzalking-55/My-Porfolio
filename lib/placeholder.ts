/* ============================================================
 * Placeholder convention:
 * any string that looks like "[...]" is unfinished content.
 * Components render it with a dashed "REPLACE ME" treatment so
 * you can instantly see what still needs your real information
 * — and so nothing ever looks like a fake fact.
 * ============================================================ */

export function isPlaceholder(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value !== "string") return false;
  return /^\[.*\]$/.test(value.trim());
}

/** True only for values safe to render as real links. */
export function isRealUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^https?:\/\/[^\s]+$/.test(value.trim());
}

/** Split a string of "words" into tokens for search — tiny util. */
export function normalize(text: string): string {
  return text.toLowerCase().trim();
}
