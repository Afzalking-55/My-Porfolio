/* /api/private/people — list & create people entries. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { createPerson, getPeople } from "@/lib/private-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardJson();
  if (denied) return denied;
  return NextResponse.json(await getPeople(), { headers: { ...NO_STORE } });
}

export async function POST(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  try {
    const body = await req.json();
    const person = await createPerson(body ?? {});
    return NextResponse.json(person, { status: 201, headers: { ...NO_STORE } });
  } catch {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
}
