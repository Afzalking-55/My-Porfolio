/* ============================================================
 * Persistence layer — dual backend, auto-detected:
 *
 * JSON documents (content, journal, people, places, photo meta)
 *   • Vercel KV  when KV_REST_API_URL + KV_REST_API_TOKEN exist
 *   • files under ./data/private otherwise (local dev, Docker)
 *
 * Photo binaries
 *   • Vercel Blob with access:"private" when BLOB_READ_WRITE_TOKEN
 *     exists — the CDN answers 401 to EVERY direct request; bytes are
 *     only readable server-side, through this module, inside the
 *     authenticated photo route.
 *   • ./data/private/photos otherwise.
 *
 * This module is deliberately the ONLY place that touches storage.
 * ============================================================ */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "private");
export const PHOTOS_DIR = path.join(DATA_DIR, "photos");

export const KV_MODE = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
export const BLOB_MODE = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const KEY_NS = "rm:"; // single namespace inside the store: "The Real Me"

/** uuid + short extension — anything else is rejected outright (no traversal) */
const SAFE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{3,4}$/i;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function extMime(id: string): string {
  return MIME[id.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream";
}

async function ensureDirs() {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
}

/* ---------- JSON documents ---------- */

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  if (KV_MODE) {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get<string>(KEY_NS + file);
    if (typeof raw !== "string") return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  await ensureDirs();
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** file mode is atomic (temp + rename); KV set is single-write */
export async function writeJSON(file: string, value: unknown): Promise<void> {
  if (KV_MODE) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KEY_NS + file, JSON.stringify(value));
    return;
  }
  await ensureDirs();
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, target);
}

/* ---------- photo binaries ---------- */

/** Store bytes. Returns the private-blob URL in Vercel mode, null on disk. */
export async function putPhoto(id: string, buf: Buffer, contentType: string): Promise<string | null> {
  if (!SAFE_ID.test(id)) throw new Error("Bad photo id.");
  if (BLOB_MODE) {
    const { put } = await import("@vercel/blob");
    const res = await put(`private/${id}`, buf, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return res.url;
  }
  await ensureDirs();
  await fs.writeFile(path.join(PHOTOS_DIR, id), buf);
  return null;
}

/** Read bytes for an authenticated response. */
export async function getPhoto(
  id: string,
  blobUrl?: string
): Promise<{ buf: Buffer; contentType: string } | null> {
  if (!SAFE_ID.test(id)) return null;
  const contentType = extMime(id);
  if (BLOB_MODE) {
    if (!blobUrl) return null;
    const { get } = await import("@vercel/blob");
    const res = await get(blobUrl, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    });
    if (!res) return null; // not found or not readable with this token
    const bytes = await new Response(res.stream as ReadableStream).arrayBuffer();
    return { buf: Buffer.from(bytes), contentType };
  }
  const file = path.join(PHOTOS_DIR, id);
  const buf = await fs.readFile(file).catch(() => null);
  return buf ? { buf, contentType } : null;
}

/** Best-effort removal; metadata deletion is the caller's job. */
export async function removePhoto(id: string, blobUrl?: string): Promise<void> {
  if (BLOB_MODE) {
    if (!blobUrl) return;
    const { del } = await import("@vercel/blob");
    await del(blobUrl).catch(() => undefined);
    return;
  }
  if (!SAFE_ID.test(id)) return;
  await fs.rm(path.join(PHOTOS_DIR, id), { force: true }).catch(() => undefined);
}
