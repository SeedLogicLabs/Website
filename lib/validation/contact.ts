import { z } from "zod";
import { CONTACT_INTERESTS } from "./interests";

// Server-only schema. Topic constants live in ./interests.ts (no Zod) so the
// client form can import them without bundling the validation library.
export {
  CONTACT_INTERESTS,
  INTEREST_LABEL,
  isContactInterest,
  type ContactInterest,
} from "./interests";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
    .transform((v) => (v === "" ? null : v))
    .nullable();

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us your name.")
    .max(100, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email address is too long.")
    .pipe(z.email("Enter a valid email address.")),
  company: optionalText(120, "Company"),
  interest: z.enum(CONTACT_INTERESTS, "Choose a topic."),
  message: z
    .string()
    .trim()
    .min(10, "Give us a little more detail (at least 10 characters).")
    .max(2000, "Please keep the message under 2000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
