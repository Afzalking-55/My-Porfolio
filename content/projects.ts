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
    slug: "zlance",
    name: "Zlance",
    description:
      "An agency project started during my 10th-standard holidays. We directly reached out " +
      "to second-hand car dealers and other local sellers and offered to promote their listings " +
      "through Facebook groups — access to approximately 15 groups with a combined audience of " +
      "around 1.5 million people, where promotional listings were posted for clients. " +
      "Within roughly 2 months, we acquired 15 clients at ₹1,000 per client.",
    role:
      "Client outreach — approaching potential clients, explaining the service, acquiring them, " +
      "and handling the client side of the project.",
    tech: ["Facebook groups"],
    status: "SHIPPED",
    date: "10th-standard holidays · [year to be added]",
    categories: ["BUSINESS"],
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
];
