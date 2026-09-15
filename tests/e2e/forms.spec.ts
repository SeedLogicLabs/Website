import { test, expect } from "@playwright/test";

const hasDb = !!process.env.E2E_DATABASE_URL;

test.describe("waitlist form", () => {
  test("shows a field error for an invalid email and keeps the typed value", async ({ page }) => {
    await page.goto("/products/pesapath");
    const email = page.getByLabel("Email address");
    await email.fill("not-an-email");
    await page.getByRole("button", { name: "Join the waitlist" }).click();
    await expect(page.getByRole("alert").first()).toContainText(/valid email/i);
    await expect(email).toHaveValue("not-an-email");
  });

  test("happy path writes a signup (needs E2E_DATABASE_URL)", async ({ page }) => {
    test.skip(!hasDb, "no test database configured");
    await page.goto("/products/creature-codex");
    await page.getByLabel("Email address").fill(`e2e+${Date.now()}@example.invalid`);
    await page.getByRole("button", { name: "Join the waitlist" }).click();
    await expect(page.getByRole("status")).toContainText(/on the list/i);
  });
});

test.describe("contact form", () => {
  test("preselects the topic from ?interest", async ({ page }) => {
    await page.goto("/contact?interest=id-scanner-sdk");
    await expect(page.getByLabel("Topic")).toHaveValue("id-scanner-sdk");
  });

  test("ignores an unknown ?interest", async ({ page }) => {
    await page.goto("/contact?interest=<script>");
    await expect(page.getByLabel("Topic")).toHaveValue("general");
  });

  test("reports validation errors per field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("A");
    await page.getByLabel("Email address").fill("nope");
    await page.getByLabel("Message").fill("short");
    await page.getByRole("button", { name: "Send message" }).click();
    const alerts = page.getByRole("alert");
    await expect(alerts.filter({ hasText: /name/i })).toBeVisible();
    await expect(alerts.filter({ hasText: /valid email/i })).toBeVisible();
    await expect(alerts.filter({ hasText: /more detail/i })).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("A");
  });

  test("happy path stores a request (needs E2E_DATABASE_URL)", async ({ page }) => {
    test.skip(!hasDb, "no test database configured");
    await page.goto("/contact?interest=partnership");
    await page.getByLabel("Name").fill("E2E Tester");
    await page.getByLabel("Email address").fill(`e2e+${Date.now()}@example.invalid`);
    await page.getByLabel("Message").fill("Automated end-to-end test submission, please ignore.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText(/message is in/i);
  });
});
