import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
      <Container className="relative py-32 text-center sm:py-40">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          This page has not sprouted yet.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">
          The link may be old or mistyped. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/products" variant="secondary">
            See products
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
