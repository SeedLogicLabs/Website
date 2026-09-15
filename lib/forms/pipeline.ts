import { z } from "zod";
import { HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { MESSAGES, type ActionState } from "./state";

/** What the atomic count-and-insert reports back. */
export type InsertOutcome = {
  /** Submissions from this IP hash in the window, before this one. */
  recentCount: number;
  /** 1 if a row was written, 0 if rate limited or a duplicate. */
  inserted: number;
};

export type PipelineDeps<Input> = {
  /** Resolve the salted IP hash. May throw when the salt is misconfigured. */
  ipHash: () => Promise<string> | string;
  /** Perform the atomic insert. May throw on database errors. */
  insert: (data: Input, ipHash: string) => Promise<InsertOutcome>;
  /** Per-IP submissions allowed per rolling hour. */
  limit: number;
  /** Structured, PII-free logging hook. */
  log?: (event: string, meta?: Record<string, unknown>) => void;
};

/**
 * Shared Server Action body for lead forms. Pure and dependency-injected so
 * it is unit-testable without a database or the Next runtime.
 *
 * Order matters: honeypot and validation return before any environment or
 * database access, so invalid input never costs a query.
 */
export async function runFormPipeline<
  Shape extends z.ZodRawShape,
  Field extends string = Extract<keyof Shape, string>,
>(args: {
  formData: FormData;
  schema: z.ZodObject<Shape>;
  successMessage: string;
  deps: PipelineDeps<z.output<z.ZodObject<Shape>>>;
}): Promise<ActionState<Field>> {
  const { formData, schema, successMessage, deps } = args;
  const log = deps.log ?? (() => {});

  // 1. Honeypot: bots fill every field. Pretend it worked.
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") {
    log("form.honeypot");
    return { status: "success", message: successMessage };
  }

  // 2. Validate only the fields the schema knows about.
  const raw: Record<string, unknown> = {};
  const values: Partial<Record<Field, string>> = {};
  for (const key of Object.keys(schema.shape) as Field[]) {
    const v = formData.get(key);
    raw[key] = v ?? undefined;
    if (typeof v === "string") values[key] = v;
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: MESSAGES.validation,
      fieldErrors: fieldErrors as unknown as Partial<Record<Field, string[]>>,
      values,
    };
  }

  // 3. Abuse-prevention key. Fails closed if the salt is missing in production.
  let ipHash: string;
  try {
    ipHash = await deps.ipHash();
  } catch (err) {
    log("form.ip_hash_error", { reason: err instanceof Error ? err.message : "unknown" });
    return { status: "error", message: MESSAGES.generic, values };
  }

  // 4. Atomic rate-limited insert.
  let outcome: InsertOutcome;
  try {
    outcome = await deps.insert(parsed.data, ipHash);
  } catch (err) {
    const errorId = Math.random().toString(36).slice(2, 10);
    log("form.insert_error", { errorId, name: err instanceof Error ? err.name : "unknown" });
    return { status: "error", message: MESSAGES.generic, values };
  }

  if (outcome.recentCount >= deps.limit) {
    log("form.rate_limited");
    return { status: "error", message: MESSAGES.rateLimited, values };
  }

  // inserted === 0 here means a duplicate; report success so we never reveal
  // whether an address is already on the list.
  log(outcome.inserted ? "form.inserted" : "form.duplicate");
  return { status: "success", message: successMessage };
}
