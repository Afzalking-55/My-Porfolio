"use client";

/* Private journal: list · search · create · edit · delete · tags.
 * All data flows through the authenticated /api/private/journal API. */

import { useCallback, useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon, XCloseIcon } from "@/components/private/icons";
import { CheckIcon } from "@/components/private/icons";

type Draft = { id: string | null; title: string; body: string; tags: string };

const emptyDraft: Draft = { id: null, title: "", body: "", tags: "" };

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/private/journal${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as JournalEntry[];
      setEntries(data);
      setSelectedId((cur) => (cur && data.some((e) => e.id === cur) ? cur : data[0]?.id ?? null));
    } catch {
      setError("Could not load your journal. Are you still logged in?");
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q.trim()), q.trim() ? 250 : 0); // debounce search
    return () => clearTimeout(t);
  }, [q, load]);

  const selected = entries?.find((e) => e.id === selectedId) ?? null;

  async function saveDraft() {
    if (!draft || busy) return;
    setBusy(true);
    setError(null);
    const payload = {
      title: draft.title.trim(),
      body: draft.body,
      tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(
        draft.id ? `/api/private/journal/${draft.id}` : "/api/private/journal",
        {
          method: draft.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error();
      const saved = (await res.json()) as JournalEntry;
      await load(q.trim());
      setSelectedId(saved.id);
      setDraft(null);
      setToast(draft.id ? "Entry updated." : "Entry saved.");
      setTimeout(() => setToast(null), 2000);
    } catch {
      setError("Could not save the entry — try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/private/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        await load(q.trim());
        setToast("Entry deleted.");
        setTimeout(() => setToast(null), 2000);
      } else setError("Delete failed.");
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  return (
    <>
      <div className="p-hero">
        <span className="eyebrow">Private journal · server-side storage · protected</span>
        <h1 style={{ fontSize: "clamp(34px, 5.5vw, 58px)", marginTop: 10 }}>
          Journal<span className="serif-it">.</span>
        </h1>
      </div>

      <div className="p-toolbar">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setDraft({ ...emptyDraft })}
          disabled={draft !== null}
        >
          <PlusIcon size={13} /> New entry
        </button>
        <div style={{ position: "relative", flex: "0 1 320px", minWidth: 220 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--faint)" }}>
            <SearchIcon size={14} />
          </span>
          <input
            className="j-search"
            style={{ paddingLeft: 38 }}
            placeholder="Search entries…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search journal entries"
            type="search"
          />
        </div>
      </div>

      {error && <p style={{ color: "var(--danger)", margin: "14px 0", fontSize: 13.5 }} role="alert">{error}</p>}

      <div className="journal-layout">
        <div className="j-list" role="listbox" aria-label="Journal entries">
          {entries === null ? (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skel" style={{ height: 84 }} aria-hidden />
              ))}
              <span className="faint" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>Loading…</span>
            </>
          ) : entries.length === 0 ? (
            <div className="j-empty" style={{ border: "1px dashed var(--line-strong)", borderRadius: 12 }}>
              {q ? "Nothing matches that search." : "No entries yet. Write the first one."}
            </div>
          ) : (
            entries.map((e) => (
              <button
                key={e.id}
                className={`j-item ${e.id === selectedId ? "active" : ""}`}
                onClick={() => { setSelectedId(e.id); setDraft(null); }}
                role="option"
                aria-selected={e.id === selectedId}
              >
                <h3>{e.title}</h3>
                <time>{fmtDate(e.createdAt)}</time>
                {e.tags.length > 0 && (
                  <div className="j-tags">
                    {e.tags.slice(0, 4).map((t) => <span className="tag" key={t}>#{t}</span>)}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <div>
          {draft ? (
            <div className="j-view j-form">
              <label className="field-label" htmlFor="j-title">{draft.id ? "Edit entry" : "New entry"}</label>
              <input id="j-title" placeholder="Title" value={draft.title} autoFocus
                     onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={200} />
              <textarea placeholder="Write freely. Only you can read this."
                        value={draft.body}
                        onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <input placeholder="tags, comma, separated" value={draft.tags}
                     onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setDraft(null)} disabled={busy}>
                  <XCloseIcon size={13} /> Cancel
                </button>
                <button className="btn btn-primary btn-sm" onClick={saveDraft} disabled={busy || (!draft.title.trim() && !draft.body.trim())}>
                  {busy ? <><span className="spinner" /> Saving…</> : <><CheckIcon size={13} /> Save entry</>}
                </button>
              </div>
            </div>
          ) : selected ? (
            <article className="j-view">
              <h2>{selected.title}</h2>
              <p className="j-meta">
                {fmtDate(selected.createdAt)}
                {selected.updatedAt !== selected.createdAt && ` · edited ${fmtDate(selected.updatedAt)}`}
              </p>
              <div className="j-body">{selected.body}</div>
              {selected.tags.length > 0 && (
                <div className="j-tags" style={{ marginTop: 20 }}>
                  {selected.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}
                </div>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button className="btn btn-ghost btn-sm"
                        onClick={() => setDraft({ id: selected.id, title: selected.title, body: selected.body, tags: selected.tags.join(", ") })}>
                  <PencilIcon size={13} /> Edit
                </button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)", borderColor: "rgba(224,139,124,0.35)" }}
                        onClick={() => setConfirmDelete(true)}>
                  <TrashIcon size={13} /> Delete
                </button>
              </div>
            </article>
          ) : (
            <div className="j-view j-empty">
              {entries?.length ? "Select an entry." : "Your private notebook. Entries never leave your server."}
            </div>
          )}
        </div>
      </div>

      {confirmDelete && selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="modal-box">
            <h3>Delete “{selected.title}”?</h3>
            <p className="muted" style={{ fontSize: 14 }}>This can&apos;t be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep it</button>
              <button className="btn btn-primary btn-sm" style={{ background: "var(--danger)" }}
                      onClick={() => remove(selected.id)} disabled={busy}>
                {busy ? <span className="spinner" /> : <><TrashIcon size={13} /> Delete forever</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
