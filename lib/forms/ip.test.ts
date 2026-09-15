import { describe, expect, it } from "vitest";
import { clientIp, hashIp } from "./ip";

describe("clientIp", () => {
  it("prefers Netlify's connection header, trimmed", () => {
    const h = new Headers({ "x-nf-client-connection-ip": " 41.90.1.2 ", "x-forwarded-for": "1.1.1.1" });
    expect(clientIp(h, "production")).toBe("41.90.1.2");
  });

  it("ignores forgeable x-forwarded-for in production", () => {
    const h = new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" });
    expect(clientIp(h, "production")).toBe("unknown");
  });

  it("uses the first x-forwarded-for hop outside production", () => {
    const h = new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" });
    expect(clientIp(h, "development")).toBe("9.9.9.9");
  });

  it("falls back to a shared bucket", () => {
    expect(clientIp(new Headers(), "production")).toBe("unknown");
  });
});

describe("hashIp", () => {
  it("is deterministic, salted and never contains the raw IP", () => {
    const a = hashIp("41.90.1.2", "salt-one");
    expect(a).toBe(hashIp("41.90.1.2", "salt-one"));
    expect(a).not.toBe(hashIp("41.90.1.2", "salt-two"));
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).not.toContain("41.90");
  });
});
