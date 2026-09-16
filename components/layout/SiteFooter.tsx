import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="inline-block rounded-md">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            {site.tagline}. Products for money, identity and creativity, built in{" "}
            {site.location.city}, {site.location.country}.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block font-mono text-sm text-accent-text hover:underline"
          >
            {site.email}
          </a>
        </div>

        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-faint">
              {group.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
