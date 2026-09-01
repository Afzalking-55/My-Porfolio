import type { Project } from "@/lib/types";

/* ============================================================
 * PROJECTS
 * ------------------------------------------------------------
 * To add a project: copy one block below, change the values.
 * That's it — the grid, filters and buttons update themselves.
 *
 * • status:     "IDEA" | "IN PROGRESS" | "SHIPPED" | "ON HOLD"
 * • categories: subset of "AI" | "AUTOMATION" | "WEB" | "BUSINESS" | "OTHER"
 * • image:      put a 16:9 file at public/images/projects/NAME.jpg
 *               and set image: "/images/projects/NAME.jpg"
 * • liveUrl / repoUrl: null until you actually have them —
 *               missing links render as disabled, never as fakes.
 * ============================================================ */

export const projects: Project[] = [
  {
    slug: "project-one",
    name: "[Project Name]",
    description:
      "[One or two sentences: what it does, who it is for, and what you personally built.]",
    role: "[Your role]",
    tech: ["[tool]", "[tool]"],
    status: "IDEA",
    date: "[Month Year]",
    categories: ["OTHER"],
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "project-two",
    name: "[Project Name]",
    description: "[What it does and the problem it solves.]",
    role: "[Your role]",
    tech: ["[tool]", "[tool]"],
    status: "IN PROGRESS",
    date: "[Month Year]",
    categories: ["WEB"],
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "project-three",
    name: "[Project Name]",
    description: "[Describe the automation or AI workflow you built.]",
    role: "[Your role]",
    tech: ["[tool]", "[tool]"],
    status: "IDEA",
    date: "[Month Year]",
    categories: ["AI", "AUTOMATION"],
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
];
