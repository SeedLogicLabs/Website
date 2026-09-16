import { cn } from "@/lib/cn";
import { LogoGlyph } from "./LogoGlyph";

/**
 * SeedLogic Labs mark: two leaves over a circuit node, in fixed brand colours.
 * Inline SVG, so no network request; size it with a `size-*` class.
 */
export function LogoMark({
  className,
  title = "SeedLogic Labs",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <LogoGlyph
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      className={cn("size-8", className)}
    />
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} title="" />
      <span className="text-[15px] font-semibold tracking-tight text-text">
        SeedLogic<span className="text-muted"> Labs</span>
      </span>
    </span>
  );
}
