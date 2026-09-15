import { z } from "zod";
import { PRODUCT_SLUGS } from "@/content/products";

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email address is too long.")
    .pipe(z.email("Enter a valid email address.")),
  product: z.enum(PRODUCT_SLUGS, "Choose a product."),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type WaitlistField = keyof WaitlistInput;
