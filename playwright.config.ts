import { defineConfig, devices } from "@playwright/test";

// Uncommon port so a stray local dev server on 3000 is never mistaken for ours.
const PORT = process.env.PLAYWRIGHT_PORT ?? "3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Runs against the production server (`next build` first, then `next start`)
 * so results resemble the deployed site. Set PLAYWRIGHT_BASE_URL to test a
 * deploy preview instead.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run start -- --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: !!process.env.PLAYWRIGHT_REUSE_SERVER,
        timeout: 120_000,
      },
});
