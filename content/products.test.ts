import { describe, expect, it } from "vitest";
import {
  PRODUCT_SLUGS,
  getProduct,
  isProductSlug,
  products,
  STATUS_LABEL,
} from "./products";
import { footerNav, mainNav } from "./site";
import { allRoutes } from "../app/sitemap";

describe("product catalogue", () => {
  it("has one entry per slug, in the same order as PRODUCT_SLUGS", () => {
    expect(products.map((p) => p.slug)).toEqual([...PRODUCT_SLUGS]);
  });

  it("uses url-safe slugs", () => {
    for (const slug of PRODUCT_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("has a label for every status in use", () => {
    for (const p of products) {
      expect(STATUS_LABEL[p.status]).toBeTruthy();
    }
  });

  it("has at least three features and non-empty copy per product", () => {
    for (const p of products) {
      expect(p.features.length).toBeGreaterThanOrEqual(3);
      expect(p.tagline.length).toBeGreaterThan(10);
      expect(p.summary.length).toBeGreaterThan(40);
      expect(p.description.length).toBeGreaterThan(p.summary.length);
    }
  });

  it("only the SDK carries a developer preview", () => {
    const withPreview = products.filter((p) => p.developer).map((p) => p.slug);
    expect(withPreview).toEqual(["id-scanner-sdk"]);
  });

  it("getProduct and isProductSlug agree", () => {
    expect(getProduct("pesapath")?.name).toBe("PesaPath");
    expect(getProduct("nope")).toBeUndefined();
    expect(isProductSlug("creature-codex")).toBe(true);
    expect(isProductSlug("Creature Codex")).toBe(false);
  });
});

describe("navigation and sitemap", () => {
  it("every nav href is a published route", () => {
    const routes = new Set(allRoutes());
    for (const item of mainNav) expect(routes.has(item.href)).toBe(true);
    for (const group of footerNav) {
      for (const item of group.items) expect(routes.has(item.href)).toBe(true);
    }
  });

  it("sitemap has no duplicate routes", () => {
    const routes = allRoutes();
    expect(new Set(routes).size).toBe(routes.length);
  });
});
