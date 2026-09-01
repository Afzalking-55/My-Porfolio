"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, LockIcon, ArrowRight } from "@/components/Icons";

export function LoginForm({ next = "/private", configured = true }: { next?: string; configured?: boolean }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !password) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // full navigation so middleware + server components see the new session
        window.location.assign(
          /^\/private(\/.*)?$/.test(next) ? next : "/private"
        );
        return;
      }
      setError(typeof data?.error === "string" ? data.error : "Login failed. Try again.");
      setShake((n) => n + 1);
      setBusy(false);
    } catch {
      setError("Network error — the server could not be reached.");
      setShake((n) => n + 1);
      setBusy(false);
    }
  }

  return (
    <div className="login-card">
      <div className="lock-badge" aria-hidden><LockIcon size={20} /></div>
      <h1>The Real Me</h1>
      <p className="sub">Private area. Enter the password to continue.</p>

      {!configured && (
        <p className="login-error" style={{ marginBottom: 16 }}>
          Private area is disabled: set PRIVATE_AREA_PASSWORD in the server environment.
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="pw">Password</label>
        <div className="pw-wrap">
          <input
            id="pw"
            type={show ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            placeholder="••••••••••••"
            disabled={!configured}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
          >
            {show ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
          </button>
        </div>

        <div className="login-error" key={shake} role="alert"
             style={shake ? { animation: "shake 0.4s" } : undefined}>
          {error}
        </div>

        <button className="btn btn-primary login-submit" type="submit" disabled={busy || !configured}>
          {busy ? (<><span className="spinner" /> Checking…</>) : (<>Enter <ArrowRight size={13} /></>)}
        </button>
      </form>

      <Link className="login-back" href="/">← Back to public site</Link>
    </div>
  );
}
