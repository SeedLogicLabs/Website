import type { SVGProps } from "react";

/**
 * The SeedLogic Labs mark, traced from the founder-supplied artwork and
 * recoloured to the brand palette. Two pointed leaves fan up and outward, the
 * left one smaller, higher and in a deeper orange, the right one larger and in
 * the brand orange; below them an open ring flanked by a small dot on each
 * side. Flat colour, no gradients or outlines.
 *
 * Shared by the in-page logo and the OG image renderer; `app/icon.svg` carries
 * the same geometry and colours as a static file. Renders a complete `<svg>`
 * because Satori (OG images) drops fragments placed inside `<svg>`.
 */
export const LOGO_COLORS = {
  /** Brand orange, `--color-accent`. */
  bright: "#fa6c12",
  /** Brand orange darkened ~22% for the smaller leaf. */
  deep: "#c3540e",
} as const;

export function LogoGlyph({
  bright = LOGO_COLORS.bright,
  deep = LOGO_COLORS.deep,
  ...props
}: SVGProps<SVGSVGElement> & { bright?: string; deep?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M16.1 13.8Q24.29 14.09 24.55 5.9Q17.46 6.78 16.1 13.8Z" fill={bright} />
      <path d="M15.9 9.5Q14.78 3.85 9.05 3.2Q9.36 9.74 15.9 9.5Z" fill={deep} />
      <circle cx="16" cy="24.7" r="3.07" stroke={bright} strokeWidth="2.33" />
      <circle cx="5.2" cy="24.7" r="1.53" fill={bright} />
      <circle cx="26.8" cy="24.7" r="1.53" fill={bright} />
    </svg>
  );
}
