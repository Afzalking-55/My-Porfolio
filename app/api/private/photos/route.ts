/* /api/private/photos — list metadata & upload (multipart).
 * Files are written under /data/private/photos which sits OUTSIDE
 * /public, so they are unreachable without the auth check. */

import { NextResponse } from "next/server";
import { guardJson, NO_STORE } from "@/app/api/private/_guard";
import { getPhotos, savePhoto } from "@/lib/private-data";
import type { PrivatePhoto } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** the private blob-store locator never leaves the server */
function publicMeta(p: PrivatePhoto) {
  const { blobUrl: _drop, ...rest } = p;
  return rest;
}

export async function GET() {
  const denied = await guardJson();
  if (denied) return denied;
  return NextResponse.json((await getPhotos()).map(publicMeta), { headers: { ...NO_STORE } });
}

export async function POST(req: Request) {
  const denied = await guardJson();
  if (denied) return denied;
  try {
    const form = await req.formData();
    const files = form.getAll("photos").filter((f): f is File => f instanceof File);
    if (files.length === 0) throw new Error("no files");
    if (files.length > 10) throw new Error("upload at most 10 photos at once");
    const extra = { place: form.get("place") ?? undefined, person: form.get("person") ?? undefined };
    const saved = [];
    for (const file of files) saved.push(publicMeta(await savePhoto(file, extra)));
    return NextResponse.json(saved, { status: 201, headers: { ...NO_STORE } });
  } catch (err) {
    const message = err instanceof Error && err.message.includes("MB")
      ? err.message
      : err instanceof Error && err.message.includes("accepted")
        ? err.message
        : "Upload failed — attach a JPG/PNG/WEBP/GIF under 8 MB.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
