import "server-only";
import { clientIp, hashIp } from "./ip";

let warned = false;

/**
 * Salt for IP hashing. Production fails closed without it; development falls
 * back to a fixed salt so forms work locally without extra setup.
 */
export function ipHashSalt(): string {
  const salt = process.env.IP_HASH_SALT;
  if (salt && salt.length >= 16) return salt;
  if (process.env.NODE_ENV === "production") {
    throw new Error("IP_HASH_SALT is missing or too short (min 16 chars)");
  }
  if (!warned) {
    warned = true;
    console.warn("[forms] IP_HASH_SALT not set; using a development-only salt.");
  }
  return "development-only-salt";
}

export function hashRequestIp(headers: Headers): string {
  return hashIp(clientIp(headers), ipHashSalt());
}
