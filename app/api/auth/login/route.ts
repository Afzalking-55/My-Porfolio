/* POST /api/auth/login { password }
 * Server-side password check → httpOnly session cookie.
 * Rate limited per IP. The password itself is never echoed back
 * and the comparison happens only in this process. */

import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, buildSessionCookie, privateAreaConfigured } from "@/lib/auth";
import { clientKey, registerFailedAttempt, tooManyAttempts, clearAttempts } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!privateAreaConfigured()) {
    return NextResponse.json(
      { error: "The private area is not configured yet. Set PRIVATE_AREA_PASSWORD in the server environment." },
      { status: 503 }
    );
  }

  const key = clientKey(req);
  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.password === "string") password = body.password.slice(0, 512);
  } catch {
    /* malformed body → password stays empty → 401 */
  }

  if (!password || !checkPassword(password)) {
    registerFailedAttempt(key);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  clearAttempts(key);
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true, redirect: "/private" });
  res.cookies.set(buildSessionCookie(token));
  return res;
}
