import { test, expect } from "@playwright/test";
import { allRoutes } from "../../app/sitemap";

async function expectHealthyPage(page: import("@playwright/test").Page, path: string) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto(path);
  expect(response?.status(), `${path} status`).toBe(200);
  await expect(page.locator("h1"), `${path} h1`).toHaveCount(1);
  await expect(page).toHaveTitle(/SeedLogic Labs/);
  expect(errors, `${path} console`).toEqual([]);
}

/**
 * Every fixed route renders, has exactly one h1 and logs no console errors.
 */
for (const path of allRoutes()) {
  test(`renders ${path}`, async ({ page }) => {
    await expectHealthyPage(page, path);
  });
}

/**
 * Content-driven routes (blog posts, open roles) are discovered from the live
 * sitemap so the test never drifts from what is published.
 */
test("every content URL in sitemap.xml renders", async ({ page, request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const fixed = new Set(allRoutes());
  const contentPaths = urls.filter((p) => !fixed.has(p));
  expect(contentPaths.length).toBeGreaterThan(0);
  for (const path of contentPaths) {
    await expectHealthyPage(page, path);
  }
});

test("unknown route shows the branded 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not sprouted");
});

test("draft roles are not published", async ({ page, request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toContain("/careers/flutter-engineer");
  const response = await page.goto("/careers/flutter-engineer");
  expect(response?.status()).toBe(404);
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const body = await sitemap.text();
  expect(body).toContain("/products/pesapath");
  expect(body).toContain("/blog/introducing-seedlogic-labs");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("sitemap.xml");
});

test("security headers are present", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});
