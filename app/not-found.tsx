import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "var(--pad-x)" }}>
      <div style={{ textAlign: "center" }}>
        <span className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Error 404</span>
        <h1 style={{ fontSize: "clamp(60px, 14vw, 150px)", margin: "14px 0 4px" }}>
          <span className="serif-it">Lost</span> between pages
        </h1>
        <p className="muted" style={{ maxWidth: "42ch", margin: "0 auto 30px" }}>
          This URL doesn&apos;t exist. The public site is a single page — the private one needs a key.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/">Return Home</Link>
          <Link className="btn btn-ghost" href="/login">Private Area</Link>
        </div>
      </div>
    </main>
  );
}
