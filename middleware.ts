/* ============================================================
 * Route protection at the edge.
 * - /private/*          → requires a valid session cookie,
 *                         otherwise redirected to /login
 * - /api/private/*      → requires a valid session cookie,
 *                         otherwise 401 JSON (never redirects an API call)
 * The token is verified with the same secret the login route signs it
 * with; every API route handler ALSO re-verifies it (defense in depth).
 * ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authorized = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (authorized) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/private/:path*", "/api/private/:path*"],
};
