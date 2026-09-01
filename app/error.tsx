"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" style={{ minHeight: "70svh", display: "grid", placeItems: "center" }}>
      <div className="err-panel">
        <h2>Something went sideways.</h2>
        <p>
          {error?.message ? `Details: ${error.message}` : "An unexpected error occurred while rendering this page."}
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => reset()}>Try again</button>
      </div>
    </main>
  );
}
