import { describe, expect, it } from "vitest";
import { waitlistSchema } from "./waitlist";
import { CONTACT_INTERESTS, contactSchema, INTEREST_LABEL } from "./contact";
import { PRODUCT_SLUGS } from "@/content/products";

describe("waitlistSchema", () => {
  it("normalises email case and whitespace", () => {
    const r = waitlistSchema.safeParse({ email: "  Ada@Example.COM ", product: "pesapath" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("ada@example.com");
  });

  it("accepts every product slug and nothing else", () => {
    for (const slug of PRODUCT_SLUGS) {
      expect(waitlistSchema.safeParse({ email: "a@b.co", product: slug }).success).toBe(true);
    }
    expect(waitlistSchema.safeParse({ email: "a@b.co", product: "other" }).success).toBe(false);
    expect(waitlistSchema.safeParse({ email: "a@b.co" }).success).toBe(false);
  });

  it("rejects malformed and oversized emails", () => {
    expect(waitlistSchema.safeParse({ email: "nope", product: "pesapath" }).success).toBe(false);
    expect(waitlistSchema.safeParse({ email: `${"a".repeat(250)}@b.co`, product: "pesapath" }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "",
    interest: "id-scanner-sdk",
    message: "We onboard customers and want to evaluate the SDK.",
  };

  it("accepts a valid request and nulls an empty company", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.company).toBeNull();
  });

  it("enforces lengths", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("has a label for every interest and includes every product", () => {
    for (const i of CONTACT_INTERESTS) expect(INTEREST_LABEL[i]).toBeTruthy();
    for (const slug of PRODUCT_SLUGS) expect(CONTACT_INTERESTS).toContain(slug);
    expect(contactSchema.safeParse({ ...valid, interest: "sales" }).success).toBe(false);
  });
});
