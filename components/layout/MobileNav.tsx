"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { NavLink } from "./NavLink";

/** Hamburger menu for small screens. Closes on route change and Escape. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Close the panel when the route changes (state adjusted during render,
  // the pattern React recommends instead of a setState-in-effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-line text-text hover:bg-raised"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-ink/95 backdrop-blur-md"
      >
        <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-base text-muted hover:bg-raised hover:text-text"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <ButtonLink href="/contact" className="mt-3" onClick={() => setOpen(false)}>
            Talk to us
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
