/* ============================================================
 * THE REAL ME — private dashboard sections
 * ------------------------------------------------------------
 * These are DEFAULT prompts shown after login. You can also
 * edit every section live from the dashboard itself; your
 * written edits are saved to /data/private/content.json (which
 * is git-ignored and never reaches GitHub). Editing this file
 * only changes the starting prompts.
 *
 * Nothing here contains personal facts about you — by design.
 * ============================================================ */

export interface PrivateSectionDef {
  key: string;
  title: string;
  prompt: string;
}

export const privateSections: PrivateSectionDef[] = [
  {
    key: "story",
    title: "My Story",
    prompt:
      "[Write your story as you actually live it. Who you are beyond the public brand — the honest version.]",
  },
  {
    key: "journey",
    title: "My Journey",
    prompt:
      "[The path so far: where you started, the turnings, what you survived and what you learned.]",
  },
  {
    key: "personal-goals",
    title: "Personal Goals",
    prompt:
      "[Goals that are yours — not resume goals. Health, family, character, freedom.]",
  },
  {
    key: "ambitions",
    title: "My Ambitions",
    prompt:
      "[What you're aiming at when nobody is watching, and why it matters to you.]",
  },
  {
    key: "dreams",
    title: "My Dreams",
    prompt: "[The big picture. The life you're quietly building toward — describe it in detail.]",
  },
  {
    key: "working-toward",
    title: "Things I'm Working Toward",
    prompt:
      "[Concrete, current pursuits — with rough dates if you're brave enough to write them.]",
  },
  {
    key: "development",
    title: "Personal Development",
    prompt:
      "[Who you're becoming: habits, books, changes, hard-won lessons in progress.]",
  },
  {
    key: "lessons",
    title: "Lessons I've Learned",
    prompt: "[What experience has actually taught you so far.]",
  },
  {
    key: "ideas",
    title: "Ideas",
    prompt:
      "[Raw idea vault — unfiltered. Half-formed is the point of this section.]",
  },
  {
    key: "future",
    title: "Future Plans",
    prompt:
      "[Decisions you've already made about what's coming. The plan only you know.]",
  },
  {
    key: "yearly",
    title: "Yearly Goals",
    prompt:
      "[This year, defined by you. Review and rewrite it each January — the journal is a good place for that.]",
  },
  {
    key: "timeline",
    title: "Personal Timeline",
    prompt:
      "[Your timeline so far, in your own words — the moments that actually shaped the path. Add one line per chapter: date → what happened → what it meant.]",
  },
  {
    key: "contacts",
    title: "Private Contacts",
    prompt:
      "[Phone numbers and personal accounts that must never appear on the public site. The public contact section links here for this.]",
  },
  {
    key: "personal-details",
    title: "Personal Details",
    prompt:
      "[Date of birth · age · phone · anything personal you choose to keep here. Never on the public site, never in the repo — saved to this server only.]",
  },
  {
    key: "personal-side",
    title: "My Personal Side",
    prompt:
      "[The private accounts and the words you live by. Add them here — this text lives only in the local encrypted-at-rest store you control.]",
  },
  {
    key: "interests",
    title: "My Interests",
    prompt:
      "[What you love, off the record. Raw list is fine — no performance metrics here.]",
  },
];
