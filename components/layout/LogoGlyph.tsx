import type { SVGProps } from "react";

/**
 * The SeedLogic Labs mark, single colour, no gradients: a sprout (stem and
 * two leaves, the left one slightly smaller) stacked over a circuit node (an
 * open ring flanked by two dots). Shared by the in-page logo and the OG image
 * renderer; `app/icon.svg` carries the same geometry as a static file.
 *
 * Renders a complete `<svg>` so Satori (OG images) can consume it; Satori
 * drops fragments inside `<svg>`. `color` defaults to `currentColor` so the
 * in-page mark follows text colour; Satori needs an explicit hex value.
 */
export function LogoGlyph({
  color = "currentColor",
  ...props
}: Omit<SVGProps<SVGSVGElement>, "color"> & { color?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M16 12V15" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 12C16 7.2 19.2 4 24.5 4C24.5 8.8 21.3 12 16 12Z" fill={color} />
      <path d="M16 12.6C16 8.9 13.4 6.4 9.3 6.4C9.3 10.1 11.9 12.6 16 12.6Z" fill={color} />
      <circle cx="16" cy="24" r="4.2" stroke={color} strokeWidth="2.6" />
      <circle cx="7.4" cy="24" r="1.7" fill={color} />
      <circle cx="24.6" cy="24" r="1.7" fill={color} />
    </svg>
  );
}
