import type { SVGProps } from "react";

/**
 * The SeedLogic Labs mark, flat colour, no gradients or outlines: two pointed
 * leaves meeting at one point and fanning up and outward in a wide V, the left
 * one smaller and in a deeper orange, the right one larger and in the brand
 * orange; below them an open ring flanked by a small dot on each side.
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
      <path d="M15.5 14.5C15.2 9 19 4.5 25 4.5C24.5 10 20.5 14.2 15.5 14.5Z" fill={bright} />
      <path d="M15.5 14.5C15.6 10.8 12.8 7.5 7.5 7.5C7.9 11.3 11.2 14.3 15.5 14.5Z" fill={deep} />
      <circle cx="16" cy="23" r="3.6" stroke={bright} strokeWidth="2.6" />
      <circle cx="6.2" cy="23" r="1.7" fill={bright} />
      <circle cx="25.8" cy="23" r="1.7" fill={bright} />
    </svg>
  );
}
