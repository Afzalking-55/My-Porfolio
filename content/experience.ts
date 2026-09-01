import type { TimelineEntry } from "@/lib/types";

/* ============================================================
 * EXPERIENCE TIMELINE
 * ------------------------------------------------------------
 * Nothing is invented here. These are empty slots in the exact
 * shapes that matter (projects / freelance / business /
 * academic). Replace each [placeholder] with a real entry, or
 * delete the slot. Newest first.
 * ============================================================ */

export const experience: TimelineEntry[] = [
  {
    period: "[Month Year – Month Year]",
    title: "[What you worked on — e.g. Built an automation workflow for a small business]",
    org: "[Freelance / own project / company — only if real]",
    kind: "PROJECT",
    description:
      "[2–3 honest sentences: the problem, what you did, what you learned. Skip metrics you can't back up.]",
  },
  {
    period: "[Month Year – Present]",
    title: "[Business experiment / learning sprint / collaboration]",
    org: "[Where or with whom]",
    kind: "BUSINESS",
    description: "[What it is and where it currently stands.]",
  },
];
