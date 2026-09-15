import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { products } from "@/content/products";

/** Every public route. Playwright iterates this list as its smoke test. */
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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return allRoutes().map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/products") ? 0.8 : 0.5,
  }));
}
