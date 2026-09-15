import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("desktop nav reaches products and marks it active", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only nav");
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Products" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only nav");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("product card links to its detail page", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("link", { name: "PesaPath", exact: true }).first().click();
    await expect(page).toHaveURL(/\/products\/pesapath$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("PesaPath");
  });

  test("skip link focuses main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
  });
});

test.describe("motion fallbacks", () => {
  test("reveal blocks are visible with reduced motion, without scrolling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hidden = await page.$$eval("[data-reveal]", (els) =>
      els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length,
    );
    expect(hidden).toBe(0);
  });
});
