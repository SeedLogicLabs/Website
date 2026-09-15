import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/marketing/CtaBand";
import { getAllPosts, getPost } from "@/lib/content/blog";
import { formatDate } from "@/lib/content/schemas";
import { site } from "@/content/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: `${post.meta.date}T00:00:00Z`,
      authors: [post.meta.author],
      tags: post.meta.tags,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    author: { "@type": "Organization", name: post.meta.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    keywords: post.meta.tags.join(", "),
  };

  const { Component } = post;

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
          <Container className="relative pb-12 pt-20 sm:pt-28">
            <div className="max-w-3xl">
              <Eyebrow className="animate-rise">
                <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
                {" · "}
                {post.meta.author}
              </Eyebrow>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-text animate-rise [animation-delay:60ms] sm:text-5xl">
                {post.meta.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted animate-rise [animation-delay:120ms]">
                {post.meta.description}
              </p>
              {post.meta.tags.length ? (
                <ul className="mt-6 flex flex-wrap gap-2 animate-rise [animation-delay:180ms]">
                  {post.meta.tags.map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Container>
        </header>

        <Container className="pb-20">
          <Prose>
            <Component />
          </Prose>
          <div className="mt-12 border-t border-line pt-8">
            <ButtonLink href="/blog" variant="secondary">
              &larr; All posts
            </ButtonLink>
          </div>
        </Container>
      </article>
      <CtaBand />
    </>
  );
}
