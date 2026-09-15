import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { site } from "@/content/site";

export function CtaBand({
  title = "Building something that needs money, identity or creativity solved?",
  body = "We partner with businesses on the ID Scanner SDK and open early access to our apps through waitlists. Tell us what you are working on.",
  children,
}: {
  title?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-t border-line">
      <Container className="py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:radial-gradient(60%_80%_at_80%_50%,black,transparent)]" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">{body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {children ?? (
                <>
                  <ButtonLink href="/contact" size="lg">
                    Start a conversation
                  </ButtonLink>
                  <ButtonAnchor href={`mailto:${site.email}`} size="lg" variant="secondary">
                    {site.email}
                  </ButtonAnchor>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
