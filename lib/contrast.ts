/** WCAG 2.x contrast helpers. Pure functions; used by tests to gate the palette. */

export type Rgb = readonly [number, number, number];

/** Parse `#rgb`, `#rrggbb` or `rgba(r, g, b, a)`. Returns colour and alpha. */
export function parseColor(input: string): { rgb: Rgb; alpha: number } {
  const s = input.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const n = parseInt(h, 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 };
  }
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (rgba) {
    return {
      rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
      alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  throw new Error(`Unsupported colour: ${input}`);
}

/** Composite `fg` at `alpha` over an opaque `bg` (sRGB blend). */
export function blend(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  const mix = (i: number) => Math.round(fg[i] * alpha + bg[i] * (1 - alpha));
  return [mix(0), mix(1), mix(2)];
}

export function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
