/* ============================================================
 * Private data access — journal entries, photo metadata and
 * saved text edits. All reads/writes are server-side only and
 * every caller must be an authenticated request.
 * ============================================================ */

import { randomUUID } from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { readJSON, writeJSON, PHOTOS_DIR } from "@/lib/store";
import type { JournalEntry, PrivateContent, PrivatePhoto } from "@/lib/types";
import { privateSections } from "@/content/private";

/* ---------------- content (default prompts + saved edits) ---------------- */

export function defaultPrivateContent(): PrivateContent {
  const out: PrivateContent = {};
  for (const s of privateSections) out[s.key] = s.prompt;
  return out;
}

export async function getPrivateContent(): Promise<PrivateContent> {
  const saved = await readJSON<PrivateContent>("content.json", {});
  return { ...defaultPrivateContent(), ...saved };
}

export async function savePrivateContent(patch: PrivateContent): Promise<PrivateContent> {
  const allowedKeys = new Set(privateSections.map((s) => s.key));
  const current = await readJSON<PrivateContent>("content.json", {});
  for (const [k, v] of Object.entries(patch)) {
    if (allowedKeys.has(k) && typeof v === "string") current[k] = v.slice(0, 20000);
  }
  await writeJSON("content.json", current);
  return { ...defaultPrivateContent(), ...current };
}

/* ---------------- journal ---------------- */

export async function getJournal(): Promise<JournalEntry[]> {
  const all = await readJSON<JournalEntry[]>("journal.json", []);
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createJournalEntry(input: {
  title: string;
  body: string;
  tags?: string[];
}): Promise<JournalEntry> {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: randomUUID(),
    title: (input.title || "Untitled").slice(0, 200),
    body: (input.body || "").slice(0, 100_000),
    tags: (input.tags ?? []).slice(0, 10).map((t) => t.trim().toLowerCase()).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  };
  const all = await readJSON<JournalEntry[]>("journal.json", []);
  all.push(entry);
  await writeJSON("journal.json", all);
  return entry;
}

export async function updateJournalEntry(
  id: string,
  patch: Partial<Pick<JournalEntry, "title" | "body" | "tags">>
): Promise<JournalEntry | null> {
  const all = await readJSON<JournalEntry[]>("journal.json", []);
  const i = all.findIndex((e) => e.id === id);
  if (i === -1) return null;
  const e = all[i]!;
  if (typeof patch.title === "string") e.title = patch.title.slice(0, 200) || "Untitled";
  if (typeof patch.body === "string") e.body = patch.body.slice(0, 100_000);
  if (Array.isArray(patch.tags))
    e.tags = patch.tags.slice(0, 10).map((t) => t.trim().toLowerCase()).filter(Boolean);
  e.updatedAt = new Date().toISOString();
  all[i] = e;
  await writeJSON("journal.json", all);
  return e;
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  const all = await readJSON<JournalEntry[]>("journal.json", []);
  const next = all.filter((e) => e.id !== id);
  if (next.length === all.length) return false;
  await writeJSON("journal.json", next);
  return true;
}

/* ---------------- photos ---------------- */

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB per photo

export async function getPhotos(): Promise<PrivatePhoto[]> {
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function savePhoto(file: File): Promise<PrivatePhoto> {
  const ext = MIME_EXT[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WEBP or GIF images are accepted.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Image is larger than 8 MB.");
  const id = `${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
  await fs.writeFile(path.join(PHOTOS_DIR, id), buf);
  const photo: PrivatePhoto = {
    id,
    filename: id,
    originalName: file.name.slice(0, 120),
    caption: "",
    date: new Date().toISOString().slice(0, 10),
    size: file.size,
    addedAt: new Date().toISOString(),
  };
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  all.push(photo);
  await writeJSON("photos.json", all);
  return photo;
}

export async function updatePhoto(
  id: string,
  patch: { caption?: string; date?: string }
): Promise<PrivatePhoto | null> {
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const p = all[i]!;
  if (typeof patch.caption === "string") p.caption = patch.caption.slice(0, 500);
  if (typeof patch.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(patch.date)) p.date = patch.date;
  all[i] = p;
  await writeJSON("photos.json", all);
  return p;
}

export async function deletePhoto(id: string): Promise<boolean> {
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeJSON("photos.json", next);
  const { photoPath } = await import("@/lib/store");
  const file = photoPath(id);
  if (file) await fs.rm(file, { force: true });
  return true;
}
