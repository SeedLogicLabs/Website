/**
 * Theme plumbing shared by the root layout (init script, theme-color meta)
 * and the header toggle. No DOM access at module scope, so it is safe to
 * import from Server Components, Client Components and Vitest.
 */

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** Browser-chrome colours for `<meta name="theme-color">`. Must match `--ink` in app/globals.css. */
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#05082a",
  light: "#f4f5fb",
};

/**
 * Runs inline as the first child of <body>, before any content is parsed, so
 * the page never paints in the wrong theme. Stored choice wins, then the OS
 * preference, then dark. Kept as a fixed string so a future hash-based CSP
 * can allow it.
 */
export const themeInitScript =
  `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");` +
  `if(t!=="light"&&t!=="dark"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}` +
  `document.documentElement.dataset.theme=t}catch(e){}})()`;

function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** The theme currently applied to <html>, or null before the init script ran. */
export function getTheme(): Theme | null {
  const t = document.documentElement.dataset.theme;
  return isTheme(t) ? t : null;
}

/** The OS preference, defaulting to dark where `matchMedia` is unavailable (jsdom). */
export function systemTheme(): Theme {
  if (typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Stored choice, if any. */
export function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(t) ? t : null;
  } catch {
    return null;
  }
}

/** Apply a theme to <html> without persisting it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/** Apply and persist a theme. Storage failures (private mode, quota) are ignored. */
export function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme still applies for this page view.
  }
}

/** Notify on `data-theme` changes. Shaped for `useSyncExternalStore`. */
export function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
