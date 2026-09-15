import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "PesaPath, ID Scanner SDK, Creature Codex and Online Cyber: the products SeedLogic Labs is building for money, identity, creativity and civic services.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="What we are building."
        lead="Four products, one studio. Each solves a problem we ran into ourselves. Status labels are honest: nothing here has launched yet, and waitlists are how you get in first."
      >
        <ul className="flex flex-wrap gap-3 text-sm text-muted">
          <li className="flex items-center gap-2">
            <Badge tone="accent">In development</Badge> actively being built
          </li>
          <li className="flex items-center gap-2">
            <Badge tone="amber">Research phase</Badge> validating the problem
          </li>
        </ul>
      </PageHeader>

      <Section flush className="pt-0 sm:pt-0">
        <ProductGrid detailed />
      </Section>

      <CtaBand />
    </>
  );
}
