import type { GoalGroup } from "@/lib/types";

/* ============================================================
 * GOALS / VISION — ambitious but honest. Replace the
 * placeholders with specific, real targets.
 * ============================================================ */

export const goalGroups: GoalGroup[] = [
  {
    label: "Short Term",
    horizon: "next ~6 months",
    items: [
      "[Skill you are actively developing]",
      "[Concrete project you plan to finish]",
      "[Habit or system you're building]",
    ],
  },
  {
    label: "Medium Term",
    horizon: "1 – 2 years",
    items: [
      "[Product you want to launch]",
      "[Business goal you're working toward]",
      "[Capability you want to be genuinely good at]",
    ],
  },
  {
    label: "Long Term",
    horizon: "beyond",
    items: [
      "[The kind of company / builder you intend to become]",
      "[Technology ambition worth years of work]",
      "[What you ultimately want to accomplish]",
    ],
  },
];
