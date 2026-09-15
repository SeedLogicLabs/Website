import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/content/schemas";
import type { Post } from "@/lib/content/blog";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
        <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
        <span aria-hidden>&middot;</span>
        <span>{post.meta.author}</span>
      </div>
      <h3
        className={
          featured
            ? "mt-4 text-2xl font-semibold tracking-tight text-text sm:text-3xl"
            : "mt-4 text-xl font-semibold tracking-tight text-text"
        }
      >
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
          {post.meta.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{post.meta.description}</p>
      {post.meta.tags.length ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {post.meta.tags.map((t) => (
            <li key={t}>
              <Badge>{t}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Read post <span aria-hidden>&rarr;</span>
      </span>
    </Card>
  );
}
