import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import { roleMetadataSchema, slugSchema, type RoleMetadata } from "./schemas";

export type Role = { slug: string; meta: RoleMetadata };

const CAREERS_DIR = join(process.cwd(), "content", "careers");

async function listSlugs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(CAREERS_DIR);
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

async function loadModule(slug: string) {
  const mod = (await import(`@/content/careers/${slug}.mdx`)) as {
    default: ComponentType;
    metadata?: unknown;
  };
  const parsed = roleMetadataSchema.safeParse(mod.metadata);
  if (!parsed.success) {
    throw new Error(
      `content/careers/${slug}.mdx has invalid metadata: ${parsed.error.message}`,
    );
  }
  return { Component: mod.default, meta: parsed.data };
}

/** Every role file, any status. Used for static params so drafts prerender as 404. */
export async function getAllRoleSlugs(): Promise<string[]> {
  return listSlugs();
}

/** Roles visible on the careers page, newest first. */
export async function getOpenRoles(): Promise<Role[]> {
  const slugs = await listSlugs();
  const roles = await Promise.all(
    slugs.map(async (slug) => ({ slug, meta: (await loadModule(slug)).meta })),
  );
  return roles
    .filter((r) => r.meta.status === "open")
    .sort((a, b) => (a.meta.posted < b.meta.posted ? 1 : -1));
}

export async function getRole(slug: string) {
  if (!slugSchema.safeParse(slug).success) return null;
  const slugs = await listSlugs();
  if (!slugs.includes(slug)) return null;
  const { Component, meta } = await loadModule(slug);
  if (meta.status !== "open") return null;
  return { slug, meta, Component };
}
