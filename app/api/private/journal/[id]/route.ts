/* /api/private/journal/[id] — update & delete. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { deleteJournalEntry, updateJournalEntry } from "@/lib/private-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guardJson();
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await req.json();
    const entry = await updateJournalEntry(id, body ?? {});
    if (!entry) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(entry, { headers: { ...NO_STORE } });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await guardJson();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteJournalEntry(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { ...NO_STORE } });
}
