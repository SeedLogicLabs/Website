import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { STATUS_LABEL, type ProductStatus } from "@/content/products";

type Tone = "accent" | "amber" | "neutral";

const tones: Record<Tone, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent-text",
  amber: "border-amber/30 bg-amber/10 text-amber-text",
  neutral: "border-line-strong bg-raised text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: ComponentPropsWithoutRef<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}

const statusTone: Record<ProductStatus, Tone> = {
  "in-development": "accent",
  research: "amber",
};

/** Product status pill with a pulsing dot. */
export function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  return (
    <Badge tone={statusTone[status]} className={className}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "in-development" ? "bg-accent" : "bg-amber",
        )}
      />
      {STATUS_LABEL[status]}
    </Badge>
  );
}
