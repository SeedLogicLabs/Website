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
    // Playwright defaults to light. Pin the brand theme so the route, nav and
    // form suites stay comparable; tests/e2e/theme.spec.ts covers light.
    colorScheme: "dark",
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
        env: {
          ...process.env,
          // Happy-path form tests only run when a test database is provided.
          DATABASE_URL: process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
          IP_HASH_SALT: process.env.IP_HASH_SALT ?? "e2e-only-salt-not-for-production",
        },
      },
});
