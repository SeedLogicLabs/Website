"use client";

/**
 * Last-resort boundary that replaces the root layout. Must render its own
 * html and body. Global styles are not applied here, so styles are inline.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#05082a",
          color: "#f4f5fb",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <p style={{ color: "#fa6c12", fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: 3 }}>
            SEEDLOGIC LABS
          </p>
          <h1 style={{ fontSize: 32, margin: "12px 0 8px" }}>Something broke.</h1>
          <p style={{ color: "#a4abc9", maxWidth: 420, margin: "0 auto" }}>
            The page could not be rendered. Please try again.
          </p>
          {error.digest ? (
            <p style={{ color: "#8790b3", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
              ref {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: "12px 22px",
              borderRadius: 999,
              border: 0,
              background: "linear-gradient(100deg,#fa6c12,#ffa14a)",
              color: "#05082a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
