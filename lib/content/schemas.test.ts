import { describe, expect, it } from "vitest";
import { formatDate, postMetadataSchema, roleMetadataSchema, slugSchema } from "./schemas";

describe("postMetadataSchema", () => {
  const valid = {
    title: "Introducing SeedLogic Labs",
    description: "Why we started a product studio in Nairobi and what we are building first.",
    date: "2026-09-15",
    author: "SeedLogic Labs",
    tags: ["company"],
  };

  it("accepts a valid post and defaults draft to false", () => {
    const r = postMetadataSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.draft).toBe(false);
  });

  it("rejects bad dates and short descriptions", () => {
    expect(postMetadataSchema.safeParse({ ...valid, date: "15/09/2026" }).success).toBe(false);
    expect(postMetadataSchema.safeParse({ ...valid, date: "2026-13-40" }).success).toBe(false);
    expect(postMetadataSchema.safeParse({ ...valid, description: "too short" }).success).toBe(false);
  });
});

describe("roleMetadataSchema", () => {
  it("requires a known status and type", () => {
    const base = {
      title: "Flutter Engineer",
      team: "Mobile",
      location: "Nairobi (hybrid)",
      type: "Full-time",
      summary: "Build PesaPath and Creature Codex with a small, product-minded team.",
      status: "open",
      posted: "2026-09-15",
    };
    expect(roleMetadataSchema.safeParse(base).success).toBe(true);
    expect(roleMetadataSchema.safeParse({ ...base, status: "hiring" }).success).toBe(false);
    expect(roleMetadataSchema.safeParse({ ...base, type: "Gig" }).success).toBe(false);
  });
});

describe("helpers", () => {
  it("slugSchema allows kebab-case only", () => {
    expect(slugSchema.safeParse("hello-world-2").success).toBe(true);
    expect(slugSchema.safeParse("Hello World").success).toBe(false);
    expect(slugSchema.safeParse("_example").success).toBe(false);
  });

  it("formatDate renders a long date without timezone drift", () => {
    expect(formatDate("2026-09-15")).toBe("15 September 2026");
    expect(formatDate("2026-01-01")).toBe("1 January 2026");
  });
});
