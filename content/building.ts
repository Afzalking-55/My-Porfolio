import type { BuildingItem } from "@/lib/types";

/* ============================================================
 * CURRENTLY BUILDING
 * ------------------------------------------------------------
 * A live list of what's on your desk right now. Update freely;
 * delete items when they move into /content/projects.ts.
 * status: "IDEATING" | "BUILDING" | "LEARNING" | "SHIPPING"
 * ============================================================ */

export const currentlyBuilding: BuildingItem[] = [
  {
    title: "[AI automation system you're assembling]",
    category: "AI AUTOMATION",
    status: "BUILDING",
    note: "[One honest sentence about where it stands today.]",
  },
  {
    title: "[Website or app you're developing]",
    category: "WEB",
    status: "BUILDING",
    note: "[What it will do, who it's for.]",
  },
  {
    title: "[Business idea you're validating]",
    category: "BUSINESS",
    status: "IDEATING",
    note: "[The problem you're testing.]",
  },
  {
    title: "[Topic you're studying right now]",
    category: "LEARNING",
    status: "LEARNING",
    note: "[Course, skill or subject — and why.]",
  },
];
