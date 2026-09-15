import Link from "next/link";
import { mainNav } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/contact" size="md">
            Talk to us
          </ButtonLink>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
