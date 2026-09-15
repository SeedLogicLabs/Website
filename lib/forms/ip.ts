import { createHash } from "node:crypto";

/**
 * Resolve the visitor's IP for rate limiting.
 *
 * Netlify sets `x-nf-client-connection-ip` itself, so it cannot be forged by
 * the client. `x-forwarded-for` is attacker-controlled (a client can send its
 * own), so it is only trusted outside production for local testing.
 * Unknown IPs share one bucket rather than bypassing the limit.
 */
export function clientIp(
  headers: Headers,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): string {
  const netlify = headers.get("x-nf-client-connection-ip");
  if (netlify) return netlify.trim();

  if (nodeEnv !== "production") {
    const xff = headers.get("x-forwarded-for");
    const first = xff?.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
}

/** One-way, salted hash so raw IPs are never stored. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
