import type { SkillGroup } from "@/lib/types";

/* ============================================================
 * SKILLS
 * ------------------------------------------------------------
 * IMPORTANT: nothing here is invented. Every entry is a slot
 * waiting for your real skill. Replace [placeholders] with the
 * tools/skills you actually use, and delete whole groups you
 * don't want. The level indicator is 1–5 and counts as an
 * honest self-assessment you control.
 * ============================================================ */

export const skillGroups: SkillGroup[] = [
  {
    title: "AI",
    caption: "Working with models, prompts and applied AI.",
    skills: [
      { name: "[AI tool or concept you're learning]", description: "[What you actually do with it]", level: 2 },
    ],
  },
  {
    title: "Automation",
    caption: "Making repetitive work disappear.",
    skills: [
      { name: "[Automation tool / workflow]", description: "[What it automates for you]", level: 2 },
    ],
  },
  {
    title: "Web Development",
    caption: "Building for the browser.",
    skills: [
      { name: "[Language / framework]", description: "[What you have built with it]", level: 2 },
    ],
  },
  {
    title: "Programming",
    caption: "Fundamentals and tooling.",
    skills: [
      { name: "[Language]", description: "[Where you use it]", level: 2 },
    ],
  },
  {
    title: "Business",
    caption: "Thinking beyond the code.",
    skills: [
      { name: "[Business skill — e.g. pricing, research, ops]", description: "[How you learned it]", level: 2 },
    ],
  },
  {
    title: "Entrepreneurship",
    caption: "Spotting problems, testing ideas.",
    skills: [
      { name: "[e.g. idea validation, MVP building]", description: "[Short, honest context]", level: 2 },
    ],
  },
  {
    title: "Creative / Digital",
    caption: "Visual and content craft.",
    skills: [
      { name: "[e.g. design, editing, content]", description: "[What you create]", level: 2 },
    ],
  },
  {
    title: "Other Interests",
    caption: "Curiosity list — things you actively explore.",
    skills: [
      { name: "[Interest]", description: "[Why it matters to you]", level: 2 },
    ],
  },
];
