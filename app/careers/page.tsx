import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonAnchor } from "@/components/ui/Button";
import { PrinciplesGrid } from "@/components/marketing/PrinciplesGrid";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join ${site.name} in ${site.location.city}. Open roles and how to reach us.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Working at SeedLogic Labs")}`;
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build products people feel."
        lead={`We are a small team in ${site.location.city} shipping mobile products for money, identity and creativity. Roles are posted here when they open.`}
      />

      <Section flush className="pt-0 sm:pt-0" aria-labelledby="open-roles">
        <h2 id="open-roles" className="text-2xl font-semibold tracking-tight text-text">
          Open roles
        </h2>
        {/* Phase 3 replaces this empty state with MDX-driven job listings. */}
        <Card className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-text">No open roles right now.</p>
            <p className="mt-1 text-sm text-muted">
              We still want to hear from Flutter engineers, designers and people
              who care about identity and payments. Send a note and a link to
              your work.
            </p>
          </div>
          <ButtonAnchor href={mailto} className="shrink-0">
            Send us your CV
          </ButtonAnchor>
        </Card>
      </Section>

      <Section eyebrow="How we work" title="What you would be signing up for.">
        <PrinciplesGrid />
      </Section>
    </>
  );
}
