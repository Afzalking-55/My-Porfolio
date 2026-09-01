/* ============================================================
 * Site-level metadata used by the footer and by the
 * /login screen's copy. SEO tags are generated in app/layout.tsx.
 * ============================================================ */

export const site = {
  /** shown in the footer */
  footertagline: "Ideas, built in public. Quietly, then loudly.",

  /** copy on the password gate */
  loginIntro: "This area is private. It is not indexed, linked publicly, or readable without the password.",

  /**
   * Section order for the public page (labels are generated from
   * component headings — edit this only if you want to reorder).
   * NOTE: per owner decision, there is no public Goals/Vision section.
   */
  sections: [
    "home",
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "learning",
    "contact",
  ],
} as const;
