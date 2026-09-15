import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | undefined;

/**
 * Lazily build the Drizzle client. Nothing runs at import time, so
 * `next build` (which has no DATABASE_URL in CI) never touches the database,
 * and only this module reads the connection string.
 *
 * neon-http is stateless HTTP: one round trip per statement, no pool to
 * leak on serverless, no interactive transactions.
 */
export function getDb(): Db {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  cached = drizzle(neon(url), { schema });
  return cached;
}
