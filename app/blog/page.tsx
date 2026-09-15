import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${site.name} on building products for money, identity and creativity.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the studio."
        lead="Build logs, product updates and what we are learning along the way."
      />
      <Section flush className="pt-0 sm:pt-0">
        {/* Phase 3 replaces this with MDX posts. */}
        <Card className="max-w-2xl">
          <p className="font-medium text-text">First post coming soon.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            We are writing up how the studio started and what each product is
            for. Follow us on {site.socials.map((s) => s.label).join(" or ")} to
            hear when it lands.
          </p>
          <ButtonLink href="/products" variant="secondary" className="mt-6">
            Explore the products meanwhile
          </ButtonLink>
        </Card>
      </Section>
    </>
  );
}
