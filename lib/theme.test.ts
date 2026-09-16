import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { blend, contrastRatio, parseColor, type Rgb } from "./contrast";
import { THEME_COLOR, THEME_STORAGE_KEY, setTheme, themeInitScript } from "./theme";

const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

/** Body of the first `selector { ... }` block. These blocks have no nested braces. */
function block(selector: string): string {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`Selector not found: ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

/** Custom properties of a block, with `var(--x)` references resolved against `base`. */
function vars(body: string, base: Record<string, string> = {}): Record<string, string> {
  const out: Record<string, string> = { ...base };
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of clean.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].replace(/\s+/g, " ").trim();
  }
  for (const k of Object.keys(out)) {
    out[k] = out[k].replace(/var\((--[\w-]+)\)/g, (whole, ref: string) => out[ref] ?? whole);
  }
  return out;
}

const dark = vars(block(":root {"));
const light = vars(block(':root[data-theme="light"]'), dark);
const lightMedia = vars(block(':root:not([data-theme="dark"])'), dark);

function rgb(v: string): Rgb {
  return parseColor(v).rgb;
}

/** `token` at `alpha` over `over`, mirroring `bg-token/NN` utilities. */
function tint(token: string, alpha: number, over: string): Rgb {
  return blend(rgb(token), alpha, rgb(over));
}

describe("theme init script", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("applies a stored choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("falls back to dark without a stored choice or OS preference", () => {
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("follows a light OS preference", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("prefers a stored dark choice over a light OS preference", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("setTheme applies and persists", () => {
    setTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});

describe("globals.css palette", () => {
  it("keeps the two light blocks identical", () => {
    expect(lightMedia).toEqual(light);
  });

  it("keeps theme-color meta in sync with --ink", () => {
    expect(dark["--ink"]).toBe(THEME_COLOR.dark);
    expect(light["--ink"]).toBe(THEME_COLOR.light);
  });

  it("renders dark identically to the single-accent palette", () => {
    expect(dark["--accent-text"]).toBe(dark["--accent"]);
    expect(dark["--accent-text-hover"]).toBe(dark["--accent-2"]);
    expect(dark["--amber-text"]).toBe(dark["--amber"]);
  });

  it("keeps fills and on-accent fixed across themes", () => {
    for (const k of ["--accent", "--accent-2", "--amber", "--on-accent"]) {
      expect(light[k]).toBe(dark[k]);
    }
  });

  const AA_TEXT = 4.5;
  const AA_LARGE = 3;

  describe.each([
    ["dark", dark],
    ["light", light],
  ])("%s contrast", (_name, t) => {
    const pairs: Array<[string, Rgb, Rgb, number]> = [
      ["text on ink", rgb(t["--text"]), rgb(t["--ink"]), AA_TEXT],
      ["muted on ink", rgb(t["--muted"]), rgb(t["--ink"]), AA_TEXT],
      ["muted on surface", rgb(t["--muted"]), rgb(t["--surface"]), AA_TEXT],
      ["muted on raised", rgb(t["--muted"]), rgb(t["--raised"]), AA_TEXT],
      ["faint on ink", rgb(t["--faint"]), rgb(t["--ink"]), AA_TEXT],
      ["faint on raised", rgb(t["--faint"]), rgb(t["--raised"]), AA_TEXT],
      ["accent-text on ink", rgb(t["--accent-text"]), rgb(t["--ink"]), AA_TEXT],
      ["accent-text on surface", rgb(t["--accent-text"]), rgb(t["--surface"]), AA_TEXT],
      ["accent-text on raised", rgb(t["--accent-text"]), rgb(t["--raised"]), AA_TEXT],
      // Badge: text-accent-text on bg-accent/10 over a raised card.
      [
        "accent-text on accent/10 over raised",
        rgb(t["--accent-text"]),
        tint(t["--accent"], 0.1, t["--raised"]),
        AA_TEXT,
      ],
      ["accent-text-hover on surface", rgb(t["--accent-text-hover"]), rgb(t["--surface"]), AA_TEXT],
      [
        "amber-text on amber/10 over surface",
        rgb(t["--amber-text"]),
        tint(t["--amber"], 0.1, t["--surface"]),
        AA_TEXT,
      ],
      ["on-accent on accent", rgb(t["--on-accent"]), rgb(t["--accent"]), AA_TEXT],
      ["on-accent on accent-2", rgb(t["--on-accent"]), rgb(t["--accent-2"]), AA_TEXT],
      ["danger on ink", rgb(t["--danger"]), rgb(t["--ink"]), AA_TEXT],
      ["ink on danger (FormStatus icon)", rgb(t["--ink"]), rgb(t["--danger"]), AA_TEXT],
      // Focus indicator: UI component floor.
      ["accent-text ring on surface", rgb(t["--accent-text"]), rgb(t["--surface"]), AA_LARGE],
      // Hero display headline: large text.
      ["gradient-to on ink", rgb(t["--gradient-to"]), rgb(t["--ink"]), AA_LARGE],
    ];

    it.each(pairs)("%s", (_label, fg, bg, min) => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
    });
  });
});
