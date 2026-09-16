import { cn } from "@/lib/cn";

/**
 * SeedLogic Labs mark: a sprout whose stem rises from a circuit node.
 * Inline SVG so it inherits `currentColor` and needs no network request.
 */
export function LogoMark({
  className,
  title = "SeedLogic Labs",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      className={cn("size-8", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="slg" gradientUnits="userSpaceOnUse" x1="4" y1="28" x2="28" y2="4">
          <stop offset="0" stopColor="#fa6c12" />
          <stop offset="1" stopColor="#ffa14a" />
        </linearGradient>
      </defs>
      {/* circuit node */}
      <circle cx="16" cy="25" r="3" stroke="url(#slg)" strokeWidth="2" />
      <path d="M8 25h5M19 25h5" stroke="url(#slg)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="25" r="1.5" fill="url(#slg)" />
      <circle cx="26" cy="25" r="1.5" fill="url(#slg)" />
      {/* stem */}
      <path d="M16 22V11" stroke="url(#slg)" strokeWidth="2" strokeLinecap="round" />
      {/* leaves */}
      <path
        d="M16 15c0-4.5 3.5-7.5 8-7.5 0 4.5-3.5 7.5-8 7.5Z"
        fill="url(#slg)"
      />
      <path
        d="M16 11c0-3.5-2.8-6-6.5-6 0 3.5 2.8 6 6.5 6Z"
        fill="url(#slg)"
        opacity="0.75"
      />
    </svg>
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
