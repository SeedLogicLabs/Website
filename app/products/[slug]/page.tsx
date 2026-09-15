import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { SoftwareApplication, WithContext } from "schema-dts";
import { getProduct, products, STATUS_LABEL } from "@/content/products";
import { site } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { DeveloperPreview } from "@/components/marketing/DeveloperPreview";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.summary,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: product.category,
    operatingSystem: product.platform,
    url: `${site.url}/products/${product.slug}`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    offers: { "@type": "Offer", price: "0", priceCurrency: "KES", availability: "https://schema.org/PreOrder" },
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `${product.name} waitlist`,
  )}`;

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHeader
        eyebrow={product.category}
        title={product.name}
        lead={product.tagline}
      >
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={product.status} />
          <span className="text-sm text-muted">{product.platform}</span>
        </div>
      </PageHeader>

      <Section flush className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="text-lg leading-8 text-muted">{product.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Phase 2 replaces this mailto with the waitlist form. */}
              <ButtonAnchor href={mailto}>Join the waitlist</ButtonAnchor>
              <ButtonLink href="/contact" variant="secondary">
                Ask a question
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {[
                ["Status", STATUS_LABEL[product.status]],
                ["Platform", product.platform],
                ["Built for", product.audience],
                ["Category", product.category],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-4 text-sm">
                  <dt className="font-mono text-xs uppercase tracking-wider text-faint">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="What it does" title={<>Inside {product.name}.</>}>
        <FeatureGrid features={product.features} />
      </Section>

      {product.developer ? (
        <Section
          eyebrow="For developers"
          title="Integration preview."
          lead="A look at how the SDK will fit into your app, for teams evaluating it before release."
        >
          <DeveloperPreview data={product.developer} />
        </Section>
      ) : null}

      <Section eyebrow="More products" title="Also from the studio.">
        <ul className="grid gap-4 sm:grid-cols-3">
          {products
            .filter((p) => p.slug !== product.slug)
            .map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-raised"
                >
                  <span className="font-medium text-text">{p.name}</span>
                  <span className="mt-1 flex-1 text-sm text-muted">{p.tagline}</span>
                  <StatusBadge status={p.status} className="mt-4 self-start" />
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
