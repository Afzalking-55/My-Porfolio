import type { BuildingItem } from "@/lib/types";

/* ============================================================
 * CURRENTLY LEARNING — §8 (formerly "Currently Building").
 * Learning areas only — these are NOT claims of expertise.
 * No proficiency levels exist in this data model.
 * category/status labels are descriptors, not achievements.
 * ============================================================ */

export const currentlyBuilding: BuildingItem[] = [
  {
    title: "Studying 12th Standard",
    category: "EDUCATION",
    status: "LEARNING",
    note: "Currently completing my 12th-standard studies.",
  },
  {
    title: "Management",
    category: "MANAGEMENT",
    status: "LEARNING",
    note: "Learning about managing people, work, and responsibilities.",
  },
  {
    title: "Sales",
    category: "SALES",
    status: "LEARNING",
    note: "Learning sales and how to communicate with potential clients and customers.",
  },
  {
    title: "Money & Finance",
    category: "FINANCE",
    status: "LEARNING",
    note: "Learning about money, financial understanding, and how to manage it responsibly.",
  },
  {
    title: "Personal Skills",
    category: "PERSONAL",
    status: "LEARNING",
    note: "Developing useful skills through continuous learning and practical experience.",
  },
];
