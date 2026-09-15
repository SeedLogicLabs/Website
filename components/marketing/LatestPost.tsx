import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getAllPosts } from "@/lib/content/blog";
import { PostCard } from "./PostCard";

/** Home teaser for the newest post. Renders nothing when there are no posts. */
export async function LatestPost() {
  const [latest] = await getAllPosts();
  if (!latest) return null;
  return (
    <Section eyebrow="From the blog" title="Latest from the studio.">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal>
          <PostCard post={latest} featured />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base leading-7 text-muted">
            Build logs, product updates and what we are learning while we ship.
          </p>
          <ButtonLink href="/blog" variant="secondary" className="mt-5">
            All posts
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
