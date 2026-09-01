/* POST /api/auth/logout — clears the session cookie. */

import { NextResponse } from "next/server";
import { buildClearCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(buildClearCookie());
  return res;
}
