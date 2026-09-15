import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { PostCard } from "@/components/marketing/PostCard";
import { getAllPosts } from "@/lib/content/blog";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${site.name} on building products for money, identity and creativity.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const [latest, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the studio."
        lead="Build logs, product updates and what we are learning along the way."
      />
      <Section flush className="pt-0 sm:pt-0">
        {latest ? (
          <div className="grid gap-5">
            <PostCard post={latest} featured />
            {rest.length ? (
              <ul className="grid gap-5 md:grid-cols-2">
                {rest.map((p) => (
                  <li key={p.slug} className="flex">
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <Card className="max-w-2xl">
            <p className="font-medium text-text">First post coming soon.</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              We are writing up how the studio started and what each product is for.
            </p>
            <ButtonLink href="/products" variant="secondary" className="mt-6">
              Explore the products meanwhile
            </ButtonLink>
          </Card>
        )}
      </Section>
    </>
  );
}
