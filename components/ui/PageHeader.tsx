import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

/** Top-of-page title block shared by inner pages. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
      <Container className="relative pb-14 pt-20 sm:pb-20 sm:pt-28">
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow className="animate-rise">{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-text animate-rise [animation-delay:60ms] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 text-lg leading-8 text-muted animate-rise [animation-delay:120ms] sm:text-xl">
              {lead}
            </p>
          ) : null}
          {children ? (
            <div className="mt-8 animate-rise [animation-delay:180ms]">{children}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
