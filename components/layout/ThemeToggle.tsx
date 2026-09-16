"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  applyTheme,
  getTheme,
  setTheme,
  storedTheme,
  subscribe,
  systemTheme,
} from "@/lib/theme";

/**
 * Sun/moon button that flips `data-theme` on <html> and persists the choice.
 * The server snapshot is null so server and hydration markup match; React
 * re-renders with the real value right after hydration. Icon visibility is
 * CSS-driven (`light:` variant) so it is correct before hydration too.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);

  // Follow OS changes while no explicit choice is stored.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (!storedTheme()) applyTheme(mq.matches ? "light" : "dark");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    theme === null
      ? "Toggle theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      data-theme-toggle
      aria-label={label}
      onClick={() => setTheme((theme ?? systemTheme()) === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-line text-text hover:bg-raised",
        className,
      )}
    >
      {/* Sun: shown in dark (the target is light). */}
      <svg
        viewBox="0 0 24 24"
        className="size-5 light:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon: shown in light (the target is dark). */}
      <svg
        viewBox="0 0 24 24"
        className="hidden size-5 light:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
