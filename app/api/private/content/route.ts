/* /api/private/content — read & save "The Real Me" section text. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { getPrivateContent, savePrivateContent } from "@/lib/private-data";
import type { PrivateContent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardJson();
  if (denied) return denied;
  return NextResponse.json(await getPrivateContent(), { headers: { ...NO_STORE } });
}

export async function POST(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  try {
    const body = (await req.json()) as PrivateContent;
    if (!body || typeof body !== "object") throw new Error("bad body");
    const merged = await savePrivateContent(body);
    return NextResponse.json(merged, { headers: { ...NO_STORE } });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
