/* ============================================================
 * LEADERSHIP / ACHIEVEMENTS — public
 * ------------------------------------------------------------
 * Facts exactly as provided by Mohamed Afzal (2026-09-01).
 * Nothing here adds responsibilities, prizes, rankings,
 * categories or descriptions that were not supplied.
 * Wisteria date is month-precision ONLY on purpose — the exact
 * day was never provided.
 * ============================================================ */

export type Achievement = {
  kind: string;
  title: string;
  date: string; // display string, verbatim
  body?: string; // one line, composed only of provided facts
  stats?: { label: string; value: string }[]; // numbers verbatim
};

export const achievements: Achievement[] = [
  {
    kind: "School · Leadership",
    title: "Head Boy",
    date: "June 5, 2025",
    body: "I became Head Boy of Shree Niketan Patasala on June 5, 2025.",
  },
  {
    kind: "Competition",
    title: "Wisteria Competition",
    date: "August 2025",
    body: "Runner-up.",
  },
  {
    kind: "Personal skill",
    title: "Rubik's Cube",
    date: "",
    stats: [
      { label: "Average solve", value: "42.85 seconds" },
      { label: "Best solve", value: "29.30 seconds" },
    ],
  },
  {
    kind: "Content creation",
    title: "Brocode Hustlers",
    date: "3 months",
    body: "I built a YouTube channel — Brocode Hustlers.",
    stats: [
      { label: "Subscribers", value: "400" },
      { label: "Shorts published", value: "35" },
      { label: "Time period", value: "3 months" },
    ],
  },
];
