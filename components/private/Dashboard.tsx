"use client";

/* The Real Me — editable sections.
 * Content is saved server-side via /api/private/content into
 * /data/private/content.json (git-ignored, never committed). */

import { useState } from "react";
import type { PrivateContent } from "@/lib/types";
import { PencilIcon, XCloseIcon, CheckIcon } from "@/components/private/icons";

interface SectionDef { key: string; title: string; prompt: string }

function SectionCard({
  section, value, saved, onEdit,
}: {
  section: SectionDef;
  value: string;
  saved: boolean; // false = still the default prompt (untouched)
  onEdit: (key: string, text: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isPlaceholder = /^\[.*\]$/.test(value.trim());

  async function save() {
    setBusy(true);
    setErr(null);
    const ok = await onEdit(section.key, draft);
    setBusy(false);
    if (ok) setEditing(false);
    else setErr("Could not save — are you still logged in?");
  }

  return (
    <article className="p-card reveal is-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 14 }}>
        <div>
          <span className="p-kicker">{saved ? (isPlaceholder ? "untouched" : "saved") : "default prompt"}</span>
          <h2 style={{ marginTop: 6 }}>{section.title}</h2>
        </div>
        {!editing && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setDraft(value); setErr(null); setEditing(true); }}
            aria-label={`Edit ${section.title}`}
          >
            <PencilIcon size={13} /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Editing ${section.title}`}
            maxLength={20000}
          />
          {err && <p style={{ color: "var(--danger)", fontSize: 12.5 }}>{err}</p>}
          <div className="p-actions-row">
            <button className="btn btn-primary btn-sm" onClick={save} disabled={busy}>
              {busy ? <><span className="spinner" /> Saving…</> : <><CheckIcon size={13} /> Save</>}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setDraft(value); }}>
              <XCloseIcon size={13} /> Cancel
            </button>
          </div>
        </>
      ) : (
        <p className={`p-text ${isPlaceholder ? "faint" : ""}`} style={isPlaceholder ? { border: "1px dashed rgba(213,196,156,0.35)", borderRadius: 10, padding: 16 } : undefined}>
          {value || "—"}
        </p>
      )}
    </article>
  );
}

export function PrivateDashboard({
  sections, initialContent, initialSaved, ownerName,
}: {
  sections: SectionDef[];
  initialContent: PrivateContent;
  initialSaved?: string[];
  ownerName: string;
}) {
  const [content, setContent] = useState<PrivateContent>(initialContent);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set(initialSaved ?? []));
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);

  async function persist(key: string, text: string): Promise<boolean> {
    try {
      const res = await fetch("/api/private/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: text }),
      });
      if (!res.ok) return false;
      const merged = (await res.json()) as PrivateContent;
      setContent(merged);
      setSavedKeys((s) => new Set(s).add(key));
      setToast({ msg: "Saved to your private storage." });
      setTimeout(() => setToast(null), 2200);
      return true;
    } catch {
      return false;
    }
  }

  const untouched = sections.filter((s) => {
    const v = content[s.key] ?? "";
    return /^\[.*\]$/.test(v.trim());
  }).length;

  return (
    <>
      <div className="p-hero reveal is-in">
        <span className="eyebrow">Private · authenticated session · never indexed</span>
        <h1 style={{ marginTop: 12 }}>
          The Real <span className="serif-it">Me</span>
        </h1>
        <p className="p-sub">
          The version of {ownerName.replace(/^\[|\]$/g, "")} that doesn&apos;t ship with the portfolio.
          Every card below is editable — write plainly, save privately.
          {untouched > 0 && (
            <> <span className="faint">{untouched} section{untouched === 1 ? "" : "s"} still waiting for your words.</span></>
          )}
        </p>
      </div>

      <div className="p-grid">
        {sections.map((s) => (
          <SectionCard
            key={s.key}
            section={s}
            value={content[s.key] ?? s.prompt}
            saved={savedKeys.has(s.key)}
            onEdit={persist}
          />
        ))}
      </div>

      {toast && <div className={`toast ${toast.err ? "err" : ""}`} role="status">{toast.msg}</div>}
    </>
  );
}
