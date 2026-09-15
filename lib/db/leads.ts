import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "./client";
import type { InsertOutcome } from "@/lib/forms/pipeline";
import type { WaitlistInput } from "@/lib/validation/waitlist";
import type { ContactInput } from "@/lib/validation/contact";

/** Max submissions per table, per hashed IP, per rolling hour. */
export const RATE_LIMIT = 5;

type CountRow = { recent_count: number; inserted: number };

function outcome(rows: unknown[]): InsertOutcome {
  const row = rows[0] as CountRow | undefined;
  return {
    recentCount: Number(row?.recent_count ?? 0),
    inserted: Number(row?.inserted ?? 0),
  };
}

/**
 * Count-and-insert in one statement. neon-http cannot run transactions, so
 * the CTE keeps the rate-limit check and the insert atomic. Returns the
 * count *before* this insert and whether a row was written, which lets the
 * caller tell "rate limited" apart from "duplicate".
 */
export async function insertWaitlistSignup(
  data: WaitlistInput,
  ipHash: string,
  limit = RATE_LIMIT,
): Promise<InsertOutcome> {
  const result = await getDb().execute(sql`
    WITH recent AS (
      SELECT count(*)::int AS c
      FROM waitlist_signups
      WHERE ip_hash = ${ipHash}::text AND created_at > now() - interval '1 hour'
    ),
    ins AS (
      INSERT INTO waitlist_signups (email, product_slug, ip_hash)
      SELECT ${data.email}::text, ${data.product}::text, ${ipHash}::text
      WHERE (SELECT c FROM recent) < ${limit}::int
      ON CONFLICT (email, product_slug) DO NOTHING
      RETURNING id
    )
    SELECT (SELECT c FROM recent) AS recent_count,
           (SELECT count(*)::int FROM ins) AS inserted
  `);
  return outcome(result.rows);
}

export async function insertContactRequest(
  data: ContactInput,
  ipHash: string,
  limit = RATE_LIMIT,
): Promise<InsertOutcome> {
  const result = await getDb().execute(sql`
    WITH recent AS (
      SELECT count(*)::int AS c
      FROM contact_requests
      WHERE ip_hash = ${ipHash}::text AND created_at > now() - interval '1 hour'
    ),
    ins AS (
      INSERT INTO contact_requests (name, email, company, interest, message, ip_hash)
      SELECT ${data.name}::text, ${data.email}::text, ${data.company}::text,
             ${data.interest}::text, ${data.message}::text, ${ipHash}::text
      WHERE (SELECT c FROM recent) < ${limit}::int
      RETURNING id
    )
    SELECT (SELECT c FROM recent) AS recent_count,
           (SELECT count(*)::int FROM ins) AS inserted
  `);
  return outcome(result.rows);
}
