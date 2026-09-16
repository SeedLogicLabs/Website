"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/** Must be rendered inside the <form> so useFormStatus sees the pending state. */
export function SubmitButton({
  children,
  pendingText = "Sending…",
  className,
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {pending ? (
        <>
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent"
          />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
