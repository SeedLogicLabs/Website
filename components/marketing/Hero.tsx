import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { products } from "@/content/products";
import { StatusBadge } from "@/components/ui/Badge";
import Link from "next/link";

/**
 * Home hero. CSS-only entrance so the headline is present in server HTML and
 * counts as LCP immediately.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
      />
      <Container className="relative pb-20 pt-24 sm:pb-28 sm:pt-32">
        <div className="max-w-3xl">
          <Eyebrow className="animate-rise">{site.location.city}, {site.location.country} &middot; Product studio</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-text animate-rise [animation-delay:60ms] sm:text-6xl lg:text-7xl">
            <span className="text-gradient">Engineered</span> for growth.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted animate-rise [animation-delay:120ms] sm:text-xl">
            {site.name} builds mobile products for money, identity and
            creativity. Personal finance that explains itself, identity checks
            that fit in an app, and tools that turn fans into makers.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-rise [animation-delay:180ms]">
            <ButtonLink href="/products" size="lg">
              Explore products
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Talk to us
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-16 grid gap-3 animate-rise [animation-delay:260ms] sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/products/${p.slug}`}
                className="group flex h-full flex-col justify-between rounded-xl border border-line bg-surface/60 p-4 transition-colors hover:border-accent/40 hover:bg-raised"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-text">{p.name}</span>
                  <span aria-hidden className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text">
                    &rarr;
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{p.category}</p>
                <StatusBadge status={p.status} className="mt-4 self-start" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
