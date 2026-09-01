"use client";

/* Private photo gallery.
 * Files are stored server-side in /data/private/photos (outside
 * /public) and streamed ONLY through the authenticated
 * /api/private/photos/[id] route. A logged-out visitor — or a
 * search engine — cannot fetch them by guessing URLs. */

import { useCallback, useEffect, useRef, useState } from "react";
import type { PrivatePhoto } from "@/lib/types";
import {
  ChevronL, ChevronR, ImageIcon, PencilIcon, TrashIcon, UploadIcon, XCloseIcon, CheckIcon,
} from "@/components/private/icons";

export function Gallery() {
  const [photos, setPhotos] = useState<PrivatePhoto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);
  const [editing, setEditing] = useState<PrivatePhoto | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/private/photos");
      if (!res.ok) throw new Error();
      setPhotos((await res.json()) as PrivatePhoto[]);
    } catch {
      setError("Could not load photos — are you still logged in?");
      setPhotos([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // keyboard control for the lightbox
  useEffect(() => {
    if (viewer === null || !photos?.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(null);
      if (e.key === "ArrowRight") setViewer((v) => (v === null ? v : (v + 1) % photos.length));
      if (e.key === "ArrowLeft") setViewer((v) => (v === null ? v : (v - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewer, photos?.length]);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) { setError("Choose image files (JPG, PNG, WEBP or GIF)."); return; }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      list.slice(0, 10).forEach((f) => form.append("photos", f));
      const res = await fetch("/api/private/photos", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Upload failed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveMeta(photo: PrivatePhoto, caption: string, date: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/private/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, date }),
      });
      if (res.ok) { setEditing(null); await load(); }
      else setError("Could not save caption/date.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(photo: PrivatePhoto) {
    if (!window.confirm(`Delete this photo permanently? "${photo.originalName}"`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/private/photos/${photo.id}`, { method: "DELETE" });
      if (res.ok) await load();
      else setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  const current = viewer !== null && photos ? photos[viewer] : null;

  return (
    <>
      <div className="p-hero">
        <span className="eyebrow">Private photos · stored server-side · auth-gated delivery</span>
        <h1 style={{ fontSize: "clamp(34px, 5.5vw, 58px)", marginTop: 10 }}>
          Personal <span className="serif-it">photos</span>
        </h1>
        <p className="p-sub">
          These images are never uploaded to the public site, never indexed, and only stream to
          this authenticated session. JPG / PNG / WEBP / GIF · max 8 MB each.
        </p>
      </div>

      <div className="p-toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? <><span className="spinner" /> Uploading…</> : <><UploadIcon size={13} /> Upload photos</>}
        </button>
        <input
          ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", margin: "14px 0", fontSize: 13.5 }} role="alert">{error}</p>}

      <div
        className={`photo-drop ${dragOver ? "is-drag" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Drop images here to upload"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
      >
        <div style={{ margin: "0 auto 12px", width: 40, color: "var(--accent)" }}><ImageIcon size={32} /></div>
        <b>Drop images here — or click to choose</b>
        <span style={{ fontSize: 12.5 }}>Stored privately on your server, visible only after login.</span>
      </div>

      {photos === null ? (
        <div className="photos-grid" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((i) => <div className="skel" key={i} style={{ aspectRatio: "1" }} />)}
        </div>
      ) : photos.length === 0 ? (
        <p className="faint" style={{ textAlign: "center", padding: "34px 0", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          No photos yet — the gallery above is your first drop.
        </p>
      ) : (
        <div className="photos-grid">
          {photos.map((p, i) => (
            <figure key={p.id} className="photo-cell" onClick={() => setViewer(i)}>
              {/* the <img> src goes through the authenticated API route */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/private/photos/${p.id}`} alt={p.caption || p.originalName} loading="lazy"
                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.25"; }} />
              <figcaption className="pc-meta">
                <span>{p.caption || "—"}</span>
                <span className="pc-date">{p.date}</span>
              </figcaption>
              <div className="pc-tools">
                <button className="mini-btn" aria-label="Edit caption"
                        onClick={(e) => { e.stopPropagation(); setEditing(p); }}>
                  <PencilIcon size={14} />
                </button>
                <button className="mini-btn danger" aria-label="Delete photo"
                        onClick={(e) => { e.stopPropagation(); remove(p); }}>
                  <TrashIcon size={14} />
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}

      {/* full-screen viewer */}
      {current && photos && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer"
             onClick={() => setViewer(null)}>
          <button className="mini-btn lb-close" aria-label="Close viewer" onClick={() => setViewer(null)}>
            <XCloseIcon size={16} />
          </button>
          {photos.length > 1 && (
            <button className="lb-btn lb-prev" aria-label="Previous photo"
                    onClick={(e) => { e.stopPropagation(); setViewer((v) => (v! - 1 + photos.length) % photos.length); }}>
              <ChevronL size={18} />
            </button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/private/photos/${current.id}`} alt={current.caption || current.originalName} />
            <figcaption>
              {current.caption || current.originalName}
              <span className="lb-date">{current.date} · {viewer! + 1} / {photos.length}</span>
            </figcaption>
          </figure>
          {photos.length > 1 && (
            <button className="lb-btn lb-next" aria-label="Next photo"
                    onClick={(e) => { e.stopPropagation(); setViewer((v) => (v! + 1) % photos.length); }}>
              <ChevronR size={18} />
            </button>
          )}
        </div>
      )}

      {/* caption / date editor */}
      {editing && (
        <ModalEdit photo={editing} busy={busy} onCancel={() => setEditing(null)} onSave={saveMeta} />
      )}
    </>
  );
}

function ModalEdit({
  photo, busy, onCancel, onSave,
}: {
  photo: PrivatePhoto;
  busy: boolean;
  onCancel: () => void;
  onSave: (p: PrivatePhoto, caption: string, date: string) => void;
}) {
  const [caption, setCaption] = useState(photo.caption);
  const [date, setDate] = useState(photo.date);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Edit photo" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Edit details</h3>
        <label htmlFor="cap">Caption</label>
        <input id="cap" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={500} />
        <label htmlFor="dt" style={{ marginTop: 6 }}>Date</label>
        <input id="dt" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onCancel}><XCloseIcon size={13} /> Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSave(photo, caption, date)} disabled={busy}>
            {busy ? <span className="spinner" /> : <><CheckIcon size={13} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}
