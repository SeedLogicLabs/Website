import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import { postMetadataSchema, slugSchema, type PostMetadata } from "./schemas";

export type Post = { slug: string; meta: PostMetadata };

const BLOG_DIR = join(process.cwd(), "content", "blog");

async function listSlugs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(BLOG_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  return entries
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => slugSchema.safeParse(slug).success)
    .sort();
}

/**
 * Import one post module. The path prefix and `.mdx` suffix must stay literal
 * so Turbopack can build the module context (see bundled mdx.md guide).
 */
async function loadModule(slug: string) {
  const mod = (await import(`@/content/blog/${slug}.mdx`)) as {
    default: ComponentType;
    metadata?: unknown;
  };
  const parsed = postMetadataSchema.safeParse(mod.metadata);
  if (!parsed.success) {
    throw new Error(
      `content/blog/${slug}.mdx has invalid metadata: ${parsed.error.message}`,
    );
  }
  return { Component: mod.default, meta: parsed.data };
}

/** Published posts, newest first. Drafts are excluded everywhere. */
export async function getAllPosts(): Promise<Post[]> {
  const slugs = await listSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => ({ slug, meta: (await loadModule(slug)).meta })),
  );
  return posts
    .filter((p) => !p.meta.draft)
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}

export async function getPost(slug: string) {
  if (!slugSchema.safeParse(slug).success) return null;
  const slugs = await listSlugs();
  if (!slugs.includes(slug)) return null;
  const { Component, meta } = await loadModule(slug);
  if (meta.draft) return null;
  return { slug, meta, Component };
}
