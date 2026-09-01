/* Minimal hand-drawn-style line icons — 1.4px strokes, no icon-library
 * vibe. All decorative unless labelled. */

type P = { size?: number; className?: string };
const base = (size = 16, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const LockIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><circle cx="12" cy="15.6" r="1.1" fill="currentColor" stroke="none" /></svg>
);
export const ArrowRight = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M7 17 17 7" /><path d="M8.5 7H17v8.5" /></svg>
);
export const EyeIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12S18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></svg>
);
export const EyeOffIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M3 3l18 18" /><path d="M10.6 5.9a9.9 9.9 0 0 1 1.4-.1c6 0 9.5 6.2 9.5 6.2a17.4 17.4 0 0 1-3.4 4M6.3 7.9A16.8 16.8 0 0 0 2.5 12s3.5 6.2 9.5 6.2a9.4 9.4 0 0 0 3.6-.7" /><path d="M9.5 10a2.9 2.9 0 0 0 4.1 4.1" /></svg>
);
export const InstagramIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><rect x="4.5" y="4.5" width="15" height="15" rx="4.5" /><circle cx="12" cy="12" r="3.4" /><circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" /></svg>
);
export const GithubIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M9 20.2c-4.3 1.2-4.3-2.2-6-2.7m12 4.5v-3.7a2.9 2.9 0 0 0-.8-2.3c2.7-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.9 3.3 5.8 3.6 5.8 3.6a4.3 4.3 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.3v3.7" /></svg>
);
export const LinkedinIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 11v5M8 8v.1M12 16v-5m0 2.2c.3-1.3 1.3-2.2 2.7-2.2 1.9 0 3.3 1.3 3.3 3.6V16" /></svg>
);
export const XIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M4.5 4.5l15 15M19.5 4.5l-15 15" /></svg>
);
export const MailIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4.5 8 7.5 5.5L19.5 8" /></svg>
);
export const PhoneIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M8.4 3.8 10 7.3l-2 2a13.5 13.5 0 0 0 6.7 6.7l2-2 3.5 1.6v3.6a1.7 1.7 0 0 1-1.9 1.7C9.6 20.3 3.7 14.4 3.1 5.7A1.7 1.7 0 0 1 4.8 3.8Z" /></svg>
);
export const SearchIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 4.5 4.5" /></svg>
);
export const PlusIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M12 5v14M5 12h14" /></svg>
);
export const PencilIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="m14.5 5.5 4 4L8 20H4v-4Z" /><path d="m12.5 7.5 4 4" /></svg>
);
export const TrashIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.5 6.5l.9 12a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12" /></svg>
);
export const XCloseIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ChevronL = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="m14.5 6.5-5.5 5.5 5.5 5.5" /></svg>
);
export const ChevronR = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="m9.5 6.5 5.5 5.5-5.5 5.5" /></svg>
);
export const UploadIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M12 16V4.5m0 0L7.5 9M12 4.5 16.5 9" /><path d="M4.5 15.5v3A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2v-3" /></svg>
);
export const LogoutIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" /><path d="M10 12h11m0 0-3.5-3.5M21 12l-3.5 3.5" /></svg>
);
export const ImageIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 4.5-4.5 3.5 3.5 2.5-2 3.5 3" /></svg>
);
export const BookIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2Z" /><path d="M12 6.5v13" /></svg>
);
export const StarIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}><path d="M12 3.5 14.6 9l5.9.7-4.4 4.1 1.2 5.8L12 16.7l-5.3 2.9 1.2-5.8L3.5 9.7 9.4 9Z" /></svg>
);
