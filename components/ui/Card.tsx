import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Bordered surface. Add `interactive` for hover lift and glow on cards that
 * wrap a link.
 */
export function Card({
  interactive = false,
  className,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-line bg-surface/80 p-6 sm:p-8",
        interactive &&
          "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow",
        className,
      )}
      {...rest}
    />
  );
}
