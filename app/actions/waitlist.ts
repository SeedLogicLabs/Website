"use server";

import "server-only";
import { headers } from "next/headers";
import { runFormPipeline } from "@/lib/forms/pipeline";
import { MESSAGES, type ActionState } from "@/lib/forms/state";
import { hashRequestIp } from "@/lib/forms/ip-hash.server";
import { waitlistSchema, type WaitlistField } from "@/lib/validation/waitlist";
import { insertWaitlistSignup, RATE_LIMIT } from "@/lib/db/leads";

export async function joinWaitlist(
  _prev: ActionState<WaitlistField>,
  formData: FormData,
): Promise<ActionState<WaitlistField>> {
  const requestHeaders = await headers();
  return runFormPipeline({
    formData,
    schema: waitlistSchema,
    successMessage: MESSAGES.waitlistSuccess,
    deps: {
      limit: RATE_LIMIT,
      ipHash: () => hashRequestIp(requestHeaders),
      insert: insertWaitlistSignup,
      log: (event, meta) => console.info(`[waitlist] ${event}`, meta ?? ""),
    },
  });
}
