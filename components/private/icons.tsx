/* Re-export shared icons + a check mark for the private UI. */
export { PencilIcon, TrashIcon, XCloseIcon, SearchIcon, PlusIcon, UploadIcon, ImageIcon, ChevronL, ChevronR, BookIcon, StarIcon } from "@/components/Icons";

export const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);
