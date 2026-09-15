import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Drizzle Kit runs outside the Next runtime, so load .env files the same way Next does.
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Only needed for `migrate` / `push`; `generate` works offline.
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
