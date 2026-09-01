import type { SkillGroup } from "@/lib/types";

/* ============================================================
 * SKILLS — §4 personalization (Mohamed Afzal).
 * Only skills the owner actually named. No proficiency levels
 * are shown because none were provided — if you later want an
 * honest self-assessment, add `level: 1–5` to a skill and the
 * dots appear only for that skill.
 * Descriptions are short rewordings of the owner's own terms —
 * no added claims, no expert/advanced/senior/certified labels.
 * ============================================================ */

export const skillGroups: SkillGroup[] = [
  {
    title: "AI",
    caption: "Applied AI and AI-assisted work.",
    skills: [
      {
        name: "Artificial Intelligence",
        description: "A core interest area — exploring and applying AI.",
      },
      {
        name: "Working with AI tools & AI-assisted development",
        description: "Using AI tools to support and speed up development work.",
      },
    ],
  },
  {
    title: "Automation",
    caption: "Designing workflows that remove repetitive work.",
    skills: [
      {
        name: "AI automation",
        description: "Combining AI with automation for practical workflows.",
      },
      {
        name: "Workflow automation",
        description: "Mapping processes and letting software handle the repeats.",
      },
      {
        name: "n8n",
        description: "The tool I use to build automation workflows.",
      },
    ],
  },
  {
    title: "Web Development",
    caption: "Building for the browser.",
    skills: [
      {
        name: "Website development",
        description: "Building real, working websites.",
      },
      {
        name: "Building & customizing websites",
        description: "Shaping a site around what it actually needs to do.",
      },
      {
        name: "AI-assisted web development",
        description: "Using AI coding tools inside the web development workflow.",
      },
    ],
  },
  {
    title: "Programming / Technical",
    caption: "Developer tooling and technical practice.",
    skills: [
      {
        name: "GitHub",
        description: "Version control and project hosting with GitHub.",
      },
      {
        name: "Working with AI coding agents",
        description: "Directing AI agents to help plan and write code.",
      },
      {
        name: "Understanding & integrating APIs",
        description: "Reading documentation and connecting services together.",
      },
    ],
  },
  {
    title: "Business",
    caption: "The people-and-deals side of building.",
    skills: [
      {
        name: "Client acquisition",
        description: "Finding potential clients and starting the conversation.",
      },
      {
        name: "Sales",
        description: "Presenting an offer clearly and following through.",
      },
      {
        name: "Client communication",
        description: "Staying clear, responsive and consistent with clients.",
      },
      {
        name: "Understanding business requirements",
        description: "Turning what a client needs into a workable brief.",
      },
    ],
  },
  {
    title: "Entrepreneurship",
    caption: "Testing ideas, running operations.",
    skills: [
      {
        name: "Building & experimenting with business ideas",
        description: "Trying ideas, seeing what holds up, iterating.",
      },
      {
        name: "Agency operations",
        description: "Handling the day-to-day of running an agency.",
      },
      {
        name: "Developing digital services",
        description: "Defining and shaping services to offer.",
      },
    ],
  },
  {
    title: "Creative / Digital",
    caption: "Digital presence and ideas.",
    skills: [
      {
        name: "Digital projects",
        description: "Working across different kinds of digital projects.",
      },
      {
        name: "Personal branding",
        description: "Building and maintaining a consistent public presence.",
      },
      {
        name: "Content & digital ideas",
        description: "Developing content concepts and digital ideas.",
      },
    ],
  },
];
