import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JobPosting, WithContext } from "schema-dts";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllRoleSlugs, getRole } from "@/lib/content/careers";
import { formatDate } from "@/lib/content/schemas";
import { site } from "@/content/site";

export const dynamicParams = false;

/** Every role file is a static param; non-open roles prerender as 404. */
export async function generateStaticParams() {
  const slugs = await getAllRoleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/careers/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const role = await getRole(slug);
  if (!role) return { title: "Role not found", robots: { index: false } };
  return {
    title: `${role.meta.title}`,
    description: role.meta.summary,
    alternates: { canonical: `/careers/${role.slug}` },
  };
}

export default async function RolePage(props: PageProps<"/careers/[slug]">) {
  const { slug } = await props.params;
  const role = await getRole(slug);
  if (!role) notFound();

  const jsonLd: WithContext<JobPosting> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.meta.title,
    description: role.meta.summary,
    datePosted: role.meta.posted,
    employmentType: role.meta.type.toUpperCase().replace("-", "_"),
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressCountry: site.location.countryCode,
      },
    },
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Application: ${role.meta.title}`)}`;
  const { Component } = role;

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
          <Container className="relative pb-12 pt-20 sm:pt-28">
            <div className="max-w-3xl">
              <Eyebrow className="animate-rise">Careers · {role.meta.team}</Eyebrow>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-text animate-rise [animation-delay:60ms] sm:text-5xl">
                {role.meta.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted animate-rise [animation-delay:120ms]">
                {role.meta.summary}
              </p>
              <dl className="mt-6 flex flex-wrap gap-2 animate-rise [animation-delay:180ms]">
                <dt className="sr-only">Type</dt>
                <dd><Badge tone="accent">{role.meta.type}</Badge></dd>
                <dt className="sr-only">Location</dt>
                <dd><Badge>{role.meta.location}</Badge></dd>
                <dt className="sr-only">Posted</dt>
                <dd><Badge>Posted {formatDate(role.meta.posted)}</Badge></dd>
              </dl>
            </div>
          </Container>
        </header>

        <Container className="pb-20">
          <Prose>
            <Component />
          </Prose>
          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row">
            <ButtonAnchor href={mailto}>Apply by email</ButtonAnchor>
            <ButtonLink href="/careers" variant="secondary">
              &larr; All roles
            </ButtonLink>
          </div>
        </Container>
      </article>
    </>
  );
}
