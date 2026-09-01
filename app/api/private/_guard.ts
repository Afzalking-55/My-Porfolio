/* Shared guard for every /api/private/* handler.
 * The middleware already checks the cookie at the edge — this is
 * the second, in-process check (defense in depth). */

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const NO_STORE = { "Cache-Control": "no-store, private" } as const;

export async function guardJson(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { ...NO_STORE } });
  }
  return null;
}
