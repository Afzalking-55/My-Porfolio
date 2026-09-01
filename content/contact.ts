/* ============================================================
 * CONTACT & SOCIALS
 * ------------------------------------------------------------
 * §2 personalization applied (public values from Mohamed Afzal).
 * A value left as null is hidden from visitors automatically —
 * nothing fake is ever rendered or linked.
 *
 * NOTE: the phone number is deliberately NOT stored here.
 * Phone and other private details live in the authenticated
 * Private Me area (stored server-side, git-ignored).
 * ============================================================ */

export const contact = {
  /** used as a mailto: link */
  email: "mohdafzal0429@gmail.com",

  /** phone intentionally omitted from the public site */
  phone: null as string | null,

  location: null as string | null,

  /** optional line under the contact rows; null → not rendered */
  note: null as string | null,
};

/**
 * Instagram / GitHub / LinkedIn / Email icons appear in the header
 * and footer ONLY when the URL below is a real link.
 */
export const socials = {
  instagram: "https://instagram.com/afzal5",
  github: "https://github.com/Afzalking-55", // GitHub profile connected to this project
  linkedin: null as string | null, // [placeholder — account to be added when/if it exists]
  x: null as string | null,
};
