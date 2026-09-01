/* ============================================================
 * Persistence layer
 * ------------------------------------------------------------
 * Private data (journal entries, photos metadata, saved edits)
 * is stored as JSON files under /data/private and images under
 * /data/private/photos.
 *
 * This module is deliberately the ONLY place that touches disk.
 * To move to a real database later (Postgres, Supabase,
 * MongoDB, …) re-implement these exported functions — nothing
 * else in the app needs to change.
 * ============================================================ */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "private");
export const PHOTOS_DIR = path.join(DATA_DIR, "photos");

async function ensureDirs() {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** atomic-ish write: temp file + rename, so a crash can't corrupt data */
export async function writeJSON(file: string, value: unknown): Promise<void> {
  await ensureDirs();
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, target);
}

export async function readBinary(file: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(file);
  } catch {
    return null;
  }
}

export function photoPath(id: string): string | null {
  // ids are uuids; reject anything else outright (no path traversal)
  if (!/^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|gif)$/i.test(id)) return null;
  return path.join(PHOTOS_DIR, id);
}
