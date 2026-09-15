"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendContactRequest } from "@/app/actions/contact";
import { initialActionState, type ActionState } from "@/lib/forms/state";
import {
  CONTACT_INTERESTS,
  INTEREST_LABEL,
  isContactInterest,
  type ContactField,
} from "@/lib/validation/contact";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";
import { ConsentNote, FormStatus } from "./FormStatus";

/**
 * Reads `?interest=` on the client so /contact stays a static route.
 * Must be rendered inside <Suspense> by the page.
 */
export function ContactForm() {
  const params = useSearchParams();
  const requested = params.get("interest") ?? "";
  const defaultInterest = isContactInterest(requested) ? requested : "general";

  const [state, action] = useActionState<ActionState<ContactField>, FormData>(
    sendContactRequest,
    initialActionState,
  );

  if (state.status === "success") {
    return <FormStatus state={state} />;
  }

  const v = state.values ?? {};

  return (
    <form action={action} noValidate className="relative flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name" errors={state.fieldErrors?.name}>
          {(a11y) => (
            <Input {...a11y} name="name" autoComplete="name" defaultValue={v.name ?? ""} required />
          )}
        </Field>
        <Field id="contact-email" label="Email address" errors={state.fieldErrors?.email}>
          {(a11y) => (
            <Input
              {...a11y}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              defaultValue={v.email ?? ""}
              required
            />
          )}
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-company" label="Company" optional errors={state.fieldErrors?.company}>
          {(a11y) => (
            <Input {...a11y} name="company" autoComplete="organization" defaultValue={v.company ?? ""} />
          )}
        </Field>
        <Field id="contact-interest" label="Topic" errors={state.fieldErrors?.interest}>
          {(a11y) => (
            <Select {...a11y} name="interest" defaultValue={v.interest ?? defaultInterest}>
              {CONTACT_INTERESTS.map((i) => (
                <option key={i} value={i}>
                  {INTEREST_LABEL[i]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field
        id="contact-message"
        label="Message"
        errors={state.fieldErrors?.message}
        hint="What are you building, and how can we help?"
      >
        {(a11y) => (
          <Textarea {...a11y} name="message" rows={6} maxLength={2000} defaultValue={v.message ?? ""} required />
        )}
      </Field>
      <FormStatus state={state} />
      <div>
        <SubmitButton>Send message</SubmitButton>
      </div>
      <ConsentNote />
    </form>
  );
}
