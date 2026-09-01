/* ============================================================
 * Shared types. Editing content does NOT require touching
 * this file — see /content for your actual website text.
 * ============================================================ */

export type ProjectCategory = "AI" | "AUTOMATION" | "WEB" | "BUSINESS" | "OTHER";
export type ProjectStatus = "IDEA" | "IN PROGRESS" | "SHIPPED" | "ON HOLD";

export interface Project {
  slug: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  status: ProjectStatus;
  date: string;
  categories: ProjectCategory[];
  /** path under /public — leave null until you add an image */
  image: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured?: boolean;
}

export interface SkillGroup {
  title: string;
  caption: string;
  skills: { name: string; description: string; /** optional — shown only if the owner sets a level */ level?: number }[];
}

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  kind: "PROJECT" | "FREELANCE" | "BUSINESS" | "INTERNSHIP" | "ACADEMIC" | "OTHER";
  description: string;
}

export interface EducationEntry {
  period: string;
  institution: string;
  degree: string;
  field: string;
  /** optional exam result line, e.g. "444 / 500 · 88.8%" — owner-supplied only */
  result?: string;
  description: string;
  relevant: string[];
}

export interface BuildingItem {
  title: string;
  category: string;
  status: "IDEATING" | "BUILDING" | "LEARNING" | "SHIPPING";
  note: string;
}

export interface GoalGroup {
  label: string;
  horizon: string;
  items: string[];
}

/* ---------- private area (data persisted at runtime) ---------- */

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PrivatePhoto {
  id: string;
  filename: string;
  originalName: string;
  caption: string;
  date: string;
  size: number;
  addedAt: string;
}

/** editable text of "The Real Me" — merged over content/private.ts defaults */
export type PrivateContent = Record<string, string>;
