import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-base text-text placeholder:text-faint transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-invalid:border-red-400/70 aria-invalid:focus:ring-red-400/30 disabled:opacity-60";

type FieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  errors?: string[];
  optional?: boolean;
  children: (a11y: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
};

/**
 * Label + control + error wiring. The render-prop hands the control its id,
 * aria attributes and shared classes so every input type stays consistent.
 */
export function Field({ id, label, hint, errors, optional, children }: FieldProps) {
  const hasError = !!errors?.length;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-faint">(optional)</span> : null}
      </label>
      {children({
        id,
        "aria-invalid": hasError || undefined,
        "aria-describedby": describedBy,
        className: control,
      })}
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm text-red-300">
          {errors![0]}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn("min-h-32 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentPropsWithoutRef<"select">) {
  return (
    <select className={cn("appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%239aa4b2%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5%22 stroke=%22%239aa4b2%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10", className)} {...rest}>
      {children}
    </select>
  );
}
