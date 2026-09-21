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
