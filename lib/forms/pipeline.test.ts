import { describe, expect, it, vi } from "vitest";
import { runFormPipeline, type PipelineDeps } from "./pipeline";
import { MESSAGES } from "./state";
import { waitlistSchema } from "@/lib/validation/waitlist";
import { contactSchema } from "@/lib/validation/contact";
import { HONEYPOT_FIELD } from "@/components/forms/Honeypot";

function fd(entries: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

function deps<I = unknown>(overrides: Partial<PipelineDeps<I>> = {}): PipelineDeps<I> {
  return {
    limit: 5,
    ipHash: () => "hash",
    insert: vi.fn(async () => ({ recentCount: 0, inserted: 1 })),
    log: vi.fn(),
    ...overrides,
  };
}

const run = (formData: FormData, d = deps()) =>
  runFormPipeline({ formData, schema: waitlistSchema, successMessage: "ok", deps: d });

describe("runFormPipeline", () => {
  it("inserts a valid submission and reports success", async () => {
    const d = deps();
    const state = await run(fd({ email: "Ada@Example.com", product: "pesapath" }), d);
    expect(state).toEqual({ status: "success", message: "ok" });
    expect(d.insert).toHaveBeenCalledWith({ email: "ada@example.com", product: "pesapath" }, "hash");
  });

  it("silently succeeds when the honeypot is filled and never touches deps", async () => {
    const d = deps();
    const state = await run(fd({ email: "bad", product: "nope", [HONEYPOT_FIELD]: "http://spam" }), d);
    expect(state.status).toBe("success");
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("returns field errors and echoes values before any env or db access", async () => {
    const ipHash = vi.fn(() => "hash");
    const d = deps({ ipHash });
    const state = await run(fd({ email: "not-an-email", product: "pesapath" }), d);
    expect(state.status).toBe("error");
    expect(state.message).toBe(MESSAGES.validation);
    expect(state.fieldErrors?.email?.[0]).toMatch(/valid email/i);
    expect(state.values).toEqual({ email: "not-an-email", product: "pesapath" });
    expect(ipHash).not.toHaveBeenCalled();
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("rejects an unknown product slug (hidden field is untrusted)", async () => {
    const state = await run(fd({ email: "a@b.co", product: "admin" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.product?.length).toBeGreaterThan(0);
  });

  it("reports a rate limit when the window is full", async () => {
    const d = deps({ insert: vi.fn(async () => ({ recentCount: 5, inserted: 0 })) });
    const state = await run(fd({ email: "a@b.co", product: "pesapath" }), d);
    expect(state.status).toBe("error");
    expect(state.message).toBe(MESSAGES.rateLimited);
  });

  it("treats a duplicate (no row inserted, under the limit) as success", async () => {
    const d = deps({ insert: vi.fn(async () => ({ recentCount: 2, inserted: 0 })) });
    const state = await run(fd({ email: "a@b.co", product: "pesapath" }), d);
    expect(state.status).toBe("success");
  });

  it("returns a generic error when the database throws, without leaking details", async () => {
    const d = deps({ insert: vi.fn(async () => { throw new Error("connection refused to db-host"); }) });
    const state = await run(fd({ email: "a@b.co", product: "pesapath" }), d);
    expect(state.status).toBe("error");
    expect(state.message).toBe(MESSAGES.generic);
    expect(JSON.stringify(state)).not.toContain("db-host");
  });

  it("fails closed when the IP hash cannot be produced", async () => {
    const d = deps({ ipHash: () => { throw new Error("IP_HASH_SALT missing"); } });
    const state = await run(fd({ email: "a@b.co", product: "pesapath" }), d);
    expect(state.status).toBe("error");
    expect(state.message).toBe(MESSAGES.generic);
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("works with the contact schema and normalises optional company", async () => {
    const d = deps();
    const state = await runFormPipeline({
      formData: fd({ name: "Ada", email: "ADA@x.io", company: "  ", interest: "press", message: "Hello there, this is long enough." }),
      schema: contactSchema,
      successMessage: "sent",
      deps: d,
    });
    expect(state.status).toBe("success");
    expect(d.insert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ada@x.io", company: null, interest: "press" }),
      "hash",
    );
  });
});
