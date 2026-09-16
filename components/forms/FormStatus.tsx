import type { ActionState } from "@/lib/forms/state";
import { cn } from "@/lib/cn";

/** Success or error summary announced to assistive tech. */
export function FormStatus({ state, className }: { state: ActionState; className?: string }) {
  if (state.status === "idle" || !state.message) return null;
  const ok = state.status === "success";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        ok
          ? "border-accent/30 bg-accent/10 text-text"
          : "border-danger/30 bg-danger/10 text-text",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          // `danger` flips lightness with the theme, so `ink` stays legible on it
          // (7.1:1 dark, 6.0:1 light).
          ok ? "bg-accent text-on-accent" : "bg-danger text-ink",
        )}
      >
        {ok ? "✓" : "!"}
      </span>
      <p>{state.message}</p>
    </div>
  );
}

export function ConsentNote() {
  return (
    <p className="text-xs leading-5 text-faint">
      By submitting you agree we may store your details to reply to you, as described in our{" "}
      <a href="/privacy" className="text-muted underline underline-offset-4 hover:text-text">
        privacy policy
      </a>
      .
    </p>
  );
}
