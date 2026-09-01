import { isPlaceholder } from "@/lib/placeholder";
import type { ReactNode } from "react";

/* Renders a value; if it's still a [placeholder], styles it with the
 * dashed "replace me" treatment so missing info is obvious — and never
 * dressed up as a fake fact. */

export function Ph({ value, children }: { value: unknown; children?: ReactNode }) {
  if (isPlaceholder(value)) {
    return <span className="ph">{String(value ?? "[not set]")}</span>;
  }
  return <>{children ?? String(value)}</>;
}
