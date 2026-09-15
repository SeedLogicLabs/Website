"use server";

import "server-only";
import { headers } from "next/headers";
import { runFormPipeline } from "@/lib/forms/pipeline";
import { MESSAGES, type ActionState } from "@/lib/forms/state";
import { hashRequestIp } from "@/lib/forms/ip-hash.server";
import { contactSchema, type ContactField } from "@/lib/validation/contact";
import { insertContactRequest, RATE_LIMIT } from "@/lib/db/leads";

export async function sendContactRequest(
  _prev: ActionState<ContactField>,
  formData: FormData,
): Promise<ActionState<ContactField>> {
  const requestHeaders = await headers();
  return runFormPipeline({
    formData,
    schema: contactSchema,
    successMessage: MESSAGES.contactSuccess,
    deps: {
      limit: RATE_LIMIT,
      ipHash: () => hashRequestIp(requestHeaders),
      insert: insertContactRequest,
      log: (event, meta) => console.info(`[contact] ${event}`, meta ?? ""),
    },
  });
}
