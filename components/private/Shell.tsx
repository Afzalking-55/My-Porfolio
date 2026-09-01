"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutIcon } from "@/components/Icons";

const LINKS = [
  ["Dashboard", "/private"],
  ["Journal", "/private/journal"],
  ["Photos", "/private/photos"],
] as const;

export function PrivateShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/");
    }
  }

  return (
    <div className="p-shell">
      <header className="p-topbar">
        <div className="container p-topbar-inner">
          <Link href="/private" className="p-brand">
            <span className="dot" aria-hidden />
            THE REAL ME
          </Link>
          <nav className="p-nav" aria-label="Private sections">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "active" : ""}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-actions">
            <Link className="btn-lock" href="/">Public site ↗</Link>
            <button className="btn-lock" onClick={logout} disabled={busy} aria-label="Log out">
              <LogoutIcon size={13} /> {busy ? "…" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* mobile nav fallback */}
      <nav
        aria-label="Private sections"
        style={{ display: "none" }}
        className="container p-mobile-nav"
      >
        {LINKS.map(([label, href]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            {label}
          </Link>
        ))}
      </nav>

      <main id="main" className="container p-main">{children}</main>
    </div>
  );
}
