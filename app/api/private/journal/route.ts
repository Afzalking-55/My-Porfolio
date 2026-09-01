/* /api/private/journal — list (?q=search) & create entries. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { createJournalEntry, getJournal } from "@/lib/private-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
  let entries = await getJournal();
  if (q) {
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tags.some((t) => t.includes(q))
    );
  }
  return NextResponse.json(entries, { headers: { ...NO_STORE } });
}

export async function POST(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  try {
    const body = await req.json();
    if (typeof body?.title !== "string" && typeof body?.body !== "string") {
      throw new Error("nothing to save");
    }
    const entry = await createJournalEntry({
      title: body.title ?? "",
      body: body.body ?? "",
      tags: Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [],
    });
    return NextResponse.json(entry, { status: 201, headers: { ...NO_STORE } });
  } catch {
    return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
  }
}
