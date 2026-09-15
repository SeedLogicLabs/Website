import { PRODUCT_SLUGS } from "@/content/products";

/**
 * Contact-form topics. Kept free of Zod so the client bundle for ContactForm
 * does not pull the validation library in; the schema in ./contact.ts imports
 * from here and runs on the server only.
 */
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
