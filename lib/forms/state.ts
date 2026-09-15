/** Shape returned by every form Server Action and consumed by useActionState. */
export type ActionStatus = "idle" | "success" | "error";

export type ActionState<Field extends string = string> = {
  status: ActionStatus;
  /** Human-readable summary shown above or below the form. */
  message?: string;
  /** Per-field validation messages keyed by input name. */
  fieldErrors?: Partial<Record<Field, string[]>>;
  /** Submitted values echoed back on error so inputs keep what the user typed. */
  values?: Partial<Record<Field, string>>;
};

export const initialActionState: ActionState = { status: "idle" };

export const MESSAGES = {
  waitlistSuccess:
    "You are on the list. We will email you when there is something to try.",
  contactSuccess: "Thanks, your message is in. We will reply by email.",
  validation: "Please fix the highlighted fields.",
  rateLimited:
    "Too many submissions from your network right now. Please try again in an hour.",
  generic: "Something went wrong on our side. Please try again in a moment.",
} as const;
