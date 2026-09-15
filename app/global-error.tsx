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
          background: "#070a0f",
          color: "#f3f5f7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <p style={{ color: "#34d399", fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: 3 }}>
            SEEDLOGIC LABS
          </p>
          <h1 style={{ fontSize: 32, margin: "12px 0 8px" }}>Something broke.</h1>
          <p style={{ color: "#9aa4b2", maxWidth: 420, margin: "0 auto" }}>
            The page could not be rendered. Please try again.
          </p>
          {error.digest ? (
            <p style={{ color: "#7b8794", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
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
              background: "linear-gradient(100deg,#34d399,#22d3ee)",
              color: "#070a0f",
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
