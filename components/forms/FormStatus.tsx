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
          : "border-red-400/30 bg-red-400/10 text-text",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          ok ? "bg-accent text-ink" : "bg-red-400 text-ink",
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
