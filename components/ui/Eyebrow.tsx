import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Small mono label above headings. */
export function Eyebrow({ className, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent",
        className,
      )}
      {...rest}
    />
  );
}
