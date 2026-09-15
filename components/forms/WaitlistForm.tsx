"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { initialActionState, type ActionState } from "@/lib/forms/state";
import type { WaitlistField } from "@/lib/validation/waitlist";
import type { ProductSlug } from "@/content/products";
import { Field, Input } from "@/components/ui/Field";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";
import { ConsentNote, FormStatus } from "./FormStatus";

export function WaitlistForm({
  productSlug,
  productName,
}: {
  productSlug: ProductSlug;
  productName: string;
}) {
  const [state, action] = useActionState<ActionState<WaitlistField>, FormData>(
    joinWaitlist,
    initialActionState,
  );

  if (state.status === "success") {
    return <FormStatus state={state} />;
  }

  return (
    <form action={action} noValidate className="relative flex flex-col gap-4">
      <input type="hidden" name="product" value={productSlug} />
      <Honeypot />
      <Field
        id={`waitlist-email-${productSlug}`}
        label="Email address"
        errors={state.fieldErrors?.email ?? state.fieldErrors?.product}
        hint={`One email when ${productName} is ready to try. No newsletter.`}
      >
        {(a11y) => (
          <Input
            {...a11y}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.values?.email ?? ""}
            required
          />
        )}
      </Field>
      <FormStatus state={state} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton pendingText="Joining…">Join the waitlist</SubmitButton>
      </div>
      <ConsentNote />
    </form>
  );
}
