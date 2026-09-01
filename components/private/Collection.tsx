"use client";

/* Generic private collection: list · create · edit · delete · optional photos.
 * Used by Places (linkField "place") and People (linkField "person").
 * All data flows through the auth-gated /api/private/* endpoints. */

import { useCallback, useEffect, useRef, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon, UploadIcon, XCloseIcon, CheckIcon } from "@/components/private/icons";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
};

type Item = Record<string, string>;
type PhotoMeta = { id: string; caption: string; date: string; originalName: string; location?: string; place?: string; person?: string };

export function PrivateCollection({
  title,
  sub,
  endpoint,
  fields,
  linkField,
  emptyText,
  addLabel,
  showDetail = false,
}: {
  title: string;
  sub: string;
  endpoint: string;
  fields: FieldDef[];
  linkField: "place" | "person";
  emptyText: string;
  addLabel: string;
  showDetail?: boolean; // friend cards open a full view (photo, DOB, note, memories)
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [draft, setDraft] = useState<(Item & { id?: string }) | null>(null);
  const [detail, setDetail] = useState<Item | null>(null);
  const [viewer, setViewer] = useState<string | null>(null);

  const dateText = (it: Item) =>
    linkField === "person"
      ? it.dob ? `DOB · ${it.dob}` : ""
      : it.date || "no date set";
  const uploadFor = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([
        fetch(endpoint),
        fetch("/api/private/photos"),
      ]);
      if (!a.ok || !b.ok) throw new Error();
      setItems((await a.json()) as Item[]);
      setPhotos((await b.json()) as PhotoMeta[]);
    } catch {
      setError("Could not load — are you still logged in?");
      setItems([]);
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  function say(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  async function saveDraft() {
    if (!draft || busy) return;
    if (!(draft.name ?? "").trim()) { setError("Name is required."); return; }
    setBusy(true); setError(null);
    try {
      const res = await fetch(draft.id ? `${endpoint}/${draft.id}` : endpoint, {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d?.error === "string" ? d.error : "Save failed.");
      }
      setDraft(null);
      await load();
      say(draft.id ? "Updated." : "Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this entry? Photos will stay in Memories but become unlinked.")) return;
    setBusy(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) { await load(); say("Deleted."); } else setError("Delete failed.");
    } finally { setBusy(false); }
  }

  async function uploadForItem(itemId: string, files: FileList) {
    const form = new FormData();
    Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 10)
      .forEach((f) => form.append("photos", f));
    if (!form.getAll("photos").length) { setError("Choose image files."); return; }
    form.append(linkField, itemId);
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/private/photos", { method: "POST", body: form });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d?.error === "string" ? d.error : "Upload failed.");
      }
      await load();
      say("Photos added.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const viewerPhoto = photos.find((p) => p.id === viewer) ?? null;

  return (
    <>
      <div className="p-hero">
        <span className="eyebrow">Private · authenticated · server-side only</span>
        <h1 style={{ fontSize: "clamp(34px, 5.5vw, 58px)", marginTop: 10 }}>{title}</h1>
        <p className="p-sub">{sub}</p>
      </div>

      <div className="p-toolbar">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setDraft(Object.fromEntries(fields.map((f) => [f.key, ""])) as Item)}
          disabled={draft !== null}
        >
          <PlusIcon size={13} /> {addLabel}
        </button>
      </div>

      {error && <p style={{ color: "var(--danger)", margin: "14px 0", fontSize: 13.5 }} role="alert">{error}</p>}

      {items === null ? (
        <div className="collection-grid" aria-busy="true">
          {[0, 1, 2].map((i) => <div className="skel" key={i} style={{ height: 150 }} />)}
        </div>
      ) : items.length === 0 ? (
        <p className="faint" style={{ textAlign: "center", padding: "46px 0", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {emptyText}
        </p>
      ) : (
        <div className="collection-grid">
          {items.map((it) => {
            const mine = photos.filter((p) => p[linkField] === it.id);
            return (
              <article key={it.id} className="p-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div>
                    {dateText(it) && <span className="p-kicker">{dateText(it)}</span>}
                    <h2 style={{ marginTop: 4 }}>{it.name}</h2>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {showDetail && (
                      <button className="btn btn-ghost btn-sm" aria-label={`View ${it.name}`}
                              onClick={() => setDetail(it)}>View</button>
                    )}
                    <button className="mini-btn" aria-label={`Edit ${it.name}`}
                            onClick={() => setDraft({ ...it })}><PencilIcon size={14} /></button>
                    <button className="mini-btn danger" aria-label={`Delete ${it.name}`}
                            onClick={() => remove(it.id!)}><TrashIcon size={14} /></button>
                  </div>
                </div>
                {fields.filter((f) => f.key !== "name" && f.key !== "date" && f.key !== "dob").map((f) => (
                  <div key={f.key}>
                    <span className="p-kicker">{f.label}</span>
                    <p className="p-text" style={{ marginTop: 4 }}>
                      {it[f.key] ? it[f.key] : <span className="faint">—</span>}
                    </p>
                  </div>
                ))}
                <div className="photo-strip">
                  {mine.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={`/api/private/photos/${p.id}`} alt={p.caption || "photo"}
                         title={p.caption || p.date} onClick={() => setViewer(p.id)} loading="lazy" />
                  ))}
                  <button className="strip-add" onClick={() => { uploadFor.current = it.id!; fileRef.current?.click(); }}
                          aria-label={`Add photos to ${it.name}`} title="Add photos">
                    <UploadIcon size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <input
        ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple
        style={{ display: "none" }}
        onChange={(e) => { if (e.target.files && uploadFor.current) uploadForItem(uploadFor.current, e.target.files); }}
      />

      {draft && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Edit entry" onClick={() => setDraft(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <h3>{draft.id ? "Edit entry" : "New entry"}</h3>
            <label htmlFor="c-name">Name</label>
            <input id="c-name" type="text" value={draft.name ?? ""} maxLength={160} autoFocus
                   onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            {fields.filter((f) => f.key !== "name").map((f) => (
              <div key={f.key}>
                <label htmlFor={`c-${f.key}`}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea id={`c-${f.key}`} rows={4} value={draft[f.key] ?? ""} maxLength={6000}
                            placeholder={f.placeholder ?? ""}
                            style={{ resize: "vertical" }}
                            onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
                ) : (
                  <input id={`c-${f.key}`} type={f.type} value={draft[f.key] ?? ""}
                         onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setDraft(null)}><XCloseIcon size={13} /> Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={saveDraft} disabled={busy || !(draft.name ?? "").trim()}>
                {busy ? <span className="spinner" /> : <><CheckIcon size={13} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {detail && (() => {
        const mine = photos.filter((p) => p[linkField] === detail.id);
        const hero = mine[0] ?? null;
        return (
          <div className="modal" role="dialog" aria-modal="true" aria-label={`${detail.name} — details`} onClick={() => setDetail(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
              {hero ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/api/private/photos/${hero.id}`} alt={hero.caption || detail.name}
                     onClick={() => setViewer(hero.id)}
                     style={{ width: "100%", maxHeight: "42vh", objectFit: "contain", borderRadius: 10,
                              border: "1px solid var(--line)", background: "#000", cursor: "zoom-in" }} />
              ) : (
                <div className="faint" style={{ padding: "26px 0", textAlign: "center", fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  no photo yet
                </div>
              )}
              <h3>{detail.name}</h3>
              {detail.dob && (
                <p className="p-text"><span className="p-kicker">Date of birth</span><br />{detail.dob}</p>
              )}
              {detail.description && (
                <p className="p-text"><span className="p-kicker">Note</span><br />{detail.description}</p>
              )}
              {detail.memory && (
                <p className="p-text"><span className="p-kicker">Memory</span><br />{detail.memory}</p>
              )}
              {mine.length > 1 && (
                <div className="photo-strip">
                  {mine.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={`/api/private/photos/${p.id}`} alt={p.caption || "photo"}
                         onClick={() => setViewer(p.id)} loading="lazy" />
                  ))}
                </div>
              )}
              <div className="modal-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}><XCloseIcon size={13} /> Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {viewerPhoto && (
        <div className="lightbox" style={{ zIndex: 130 }} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setViewer(null)}>
          <button className="mini-btn lb-close" aria-label="Close viewer" onClick={() => setViewer(null)}>
            <XCloseIcon size={16} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/private/photos/${viewerPhoto.id}`} alt={viewerPhoto.caption || "photo"} />
            <figcaption>
              {viewerPhoto.caption || viewerPhoto.originalName || "—"}
              <span className="lb-date">{[viewerPhoto.date, viewerPhoto.location].filter(Boolean).join(" · ")}</span>
            </figcaption>
          </figure>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
