import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { products } from "@/content/products";
import { getAllPosts } from "@/lib/content/blog";
import { getOpenRoles } from "@/lib/content/careers";

/** Routes that exist regardless of content files. Playwright smoke-tests this list. */
export const STATIC_ROUTES = [
  "/",
  "/products",
  "/about",
  "/careers",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export function allRoutes(): string[] {
  return [...STATIC_ROUTES, ...products.map((p) => `/products/${p.slug}`)];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, roles] = await Promise.all([getAllPosts(), getOpenRoles()]);

  const fixed: MetadataRoute.Sitemap = allRoutes().map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/products") ? 0.8 : 0.5,
  }));

  const blog: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(`${p.meta.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const careers: MetadataRoute.Sitemap = roles.map((r) => ({
    url: `${site.url}/careers/${r.slug}`,
    lastModified: new Date(`${r.meta.posted}T00:00:00Z`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...fixed, ...blog, ...careers];
}
