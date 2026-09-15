import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Lead-capture tables. Both store personal data (emails) so the columns are
 * kept to the minimum needed to reply and to rate-limit abuse. IPs are only
 * stored as a salted SHA-256 hash.
 */
export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Lower-cased before insert. */
    email: text("email").notNull(),
    productSlug: text("product_slug").notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("waitlist_email_product_uidx").on(t.email, t.productSlug),
    index("waitlist_ip_created_idx").on(t.ipHash, t.createdAt),
  ],
);

export const contactRequests = pgTable(
  "contact_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    interest: text("interest").notNull(),
    message: text("message").notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("contact_ip_created_idx").on(t.ipHash, t.createdAt)],
);

export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
