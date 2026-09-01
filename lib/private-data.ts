/* ============================================================
 * Private data access — journal entries, photo metadata and
 * saved text edits. All reads/writes are server-side only and
 * every caller must be an authenticated request.
 * ============================================================ */

import { randomUUID } from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { readJSON, writeJSON, PHOTOS_DIR } from "@/lib/store";
import type { JournalEntry, PrivateContent, PrivatePhoto, PrivatePlace, PrivatePerson } from "@/lib/types";
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

const ID_SAFE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const optText = (v: unknown, max: number): string | undefined =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;
/** store a link only when it points at an existing uuid-shaped record id */
const linkId = (v: unknown): string | undefined =>
  typeof v === "string" && ID_SAFE.test(v) ? v : undefined;

export async function savePhoto(
  file: File,
  extra?: { place?: unknown; person?: unknown }
): Promise<PrivatePhoto> {
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
  const place = linkId(extra?.place);
  const person = linkId(extra?.person);
  if (place) photo.place = place;
  if (person) photo.person = person;
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  all.push(photo);
  await writeJSON("photos.json", all);
  return photo;
}

export async function updatePhoto(
  id: string,
  patch: {
    caption?: string;
    date?: string;
    location?: string;
    description?: string;
    place?: unknown;
    person?: unknown;
  }
): Promise<PrivatePhoto | null> {
  const all = await readJSON<PrivatePhoto[]>("photos.json", []);
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const p = all[i]!;
  const caption = optText(patch.caption, 500);
  if (caption !== undefined) p.caption = caption;
  if (typeof patch.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(patch.date)) p.date = patch.date;
  const location = optText(patch.location, 200);
  if (location !== undefined) p.location = location;
  const description = optText(patch.description, 4000);
  if (description !== undefined) p.description = description;
  if (patch.place !== undefined) {
    const v = linkId(patch.place);
    if (v) p.place = v; else delete p.place;
  }
  if (patch.person !== undefined) {
    const v = linkId(patch.person);
    if (v) p.person = v; else delete p.person;
  }
  all[i] = p;
  await writeJSON("photos.json", all);
  return p;
}

/* ---------------- places ---------------- */

export async function getPlaces(): Promise<PrivatePlace[]> {
  const all = await readJSON<PrivatePlace[]>("places.json", []);
  return all.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export async function createPlace(input: { name?: unknown; date?: unknown; memory?: unknown }): Promise<PrivatePlace> {
  const name = optText(input.name, 160);
  if (!name) throw new Error("Place name is required.");
  const place: PrivatePlace = {
    id: randomUUID(),
    name,
    date: typeof input.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : "",
    memory: optText(input.memory, 6000) ?? "",
  };
  const all = await readJSON<PrivatePlace[]>("places.json", []);
  all.push(place);
  await writeJSON("places.json", all);
  return place;
}

export async function updatePlace(id: string, patch: { name?: unknown; date?: unknown; memory?: unknown }): Promise<PrivatePlace | null> {
  const all = await readJSON<PrivatePlace[]>("places.json", []);
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const p = all[i]!;
  const name = optText(patch.name, 160);
  if (name) p.name = name;
  if (typeof patch.date === "string")
    p.date = /^\d{4}-\d{2}-\d{2}$/.test(patch.date) ? patch.date : "";
  const memory = optText(patch.memory, 6000);
  if (memory !== undefined) p.memory = memory;
  all[i] = p;
  await writeJSON("places.json", all);
  return p;
}

export async function deletePlace(id: string): Promise<boolean> {
  const all = await readJSON<PrivatePlace[]>("places.json", []);
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeJSON("places.json", next);
  // unlink (not delete) any photos that pointed here
  const photos = await readJSON<PrivatePhoto[]>("photos.json", []);
  let touched = false;
  for (const ph of photos) if (ph.place === id) { delete ph.place; touched = true; }
  if (touched) await writeJSON("photos.json", photos);
  return true;
}

/* ---------------- people ---------------- */

export async function getPeople(): Promise<PrivatePerson[]> {
  const all = await readJSON<PrivatePerson[]>("people.json", []);
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createPerson(input: { name?: unknown; description?: unknown; memory?: unknown }): Promise<PrivatePerson> {
  const name = optText(input.name, 160);
  if (!name) throw new Error("Name is required.");
  const person: PrivatePerson = {
    id: randomUUID(),
    name,
    description: optText(input.description, 2000) ?? "",
    memory: optText(input.memory, 6000) ?? "",
  };
  const all = await readJSON<PrivatePerson[]>("people.json", []);
  all.push(person);
  await writeJSON("people.json", all);
  return person;
}

export async function updatePerson(id: string, patch: { name?: unknown; description?: unknown; memory?: unknown }): Promise<PrivatePerson | null> {
  const all = await readJSON<PrivatePerson[]>("people.json", []);
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const p = all[i]!;
  const name = optText(patch.name, 160);
  if (name) p.name = name;
  const description = optText(patch.description, 2000);
  if (description !== undefined) p.description = description;
  const memory = optText(patch.memory, 6000);
  if (memory !== undefined) p.memory = memory;
  all[i] = p;
  await writeJSON("people.json", all);
  return p;
}

export async function deletePerson(id: string): Promise<boolean> {
  const all = await readJSON<PrivatePerson[]>("people.json", []);
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeJSON("people.json", next);
  const photos = await readJSON<PrivatePhoto[]>("photos.json", []);
  let touched = false;
  for (const ph of photos) if (ph.person === id) { delete ph.person; touched = true; }
  if (touched) await writeJSON("photos.json", photos);
  return true;
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
