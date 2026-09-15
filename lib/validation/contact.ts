import { z } from "zod";
import { PRODUCT_SLUGS } from "@/content/products";

/** Product slugs plus a fixed set of non-product topics. */
export const CONTACT_INTERESTS = [
  ...PRODUCT_SLUGS,
  "partnership",
  "press",
  "general",
] as const;

export type ContactInterest = (typeof CONTACT_INTERESTS)[number];

export const INTEREST_LABEL: Record<ContactInterest, string> = {
  pesapath: "PesaPath",
  "id-scanner-sdk": "ID Scanner SDK (demo or integration)",
  "creature-codex": "Creature Codex",
  "online-cyber": "Online Cyber",
  partnership: "Partnership",
  press: "Press",
  general: "Something else",
};

export function isContactInterest(value: string): value is ContactInterest {
  return (CONTACT_INTERESTS as readonly string[]).includes(value);
}

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
