/* /api/private/photos/[id]
 * GET    → streams the image bytes (auth required; nothing is cached)
 * PATCH  → update caption/date
 * DELETE → remove metadata + file
 * GET on this exact path returns metadata only; the file bytes are
 * served here because the path already passed the edge middleware —
 * and we verify the session again below. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { deletePhoto, getPhotos, updatePhoto } from "@/lib/private-data";
import { getPhoto } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guardJson();
  if (denied) return denied;
  const { id } = await params;
  // metadata is the source of truth: it carries the server-only blob locator
  const meta = (await getPhotos()).find((p) => p.id === id);
  const got = await getPhoto(id, meta?.blobUrl);
  if (!got) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return new NextResponse(new Uint8Array(got.buf), {
    headers: {
      "Content-Type": got.contentType,
      ...NO_STORE,
    },
  });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guardJson();
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await req.json();
    const photo = await updatePhoto(id, {
      caption: body?.caption,
      date: body?.date,
      location: body?.location,
      description: body?.description,
      place: body?.place,
      person: body?.person,
    });
    if (!photo) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(photo, { headers: { ...NO_STORE } });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await guardJson();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deletePhoto(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { ...NO_STORE } });
}
