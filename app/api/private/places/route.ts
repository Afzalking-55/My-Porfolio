/* /api/private/places — list & create places. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { createPlace, getPlaces } from "@/lib/private-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardJson();
  if (denied) return denied;
  return NextResponse.json(await getPlaces(), { headers: { ...NO_STORE } });
}

export async function POST(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  try {
    const body = await req.json();
    const place = await createPlace(body ?? {});
    return NextResponse.json(place, { status: 201, headers: { ...NO_STORE } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message.includes("required") ? e.message : "Invalid request." },
      { status: 400 }
    );
  }
}
