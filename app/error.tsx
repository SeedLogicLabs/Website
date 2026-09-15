"use client";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * Route error boundary. Next 16 passes `retry` (re-fetches and re-renders the
 * segment). Server errors arrive with a generic message plus `digest`.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container className="py-32 text-center sm:py-40">
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text">
        We hit an error loading this page.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">
        Try again, or head back home. If it keeps happening, tell us and quote
        the reference below.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-faint">ref {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={() => retry()}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
