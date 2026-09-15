import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((s) => !Number.isNaN(Date.parse(s)), "Not a real date");

/** `export const metadata` shape for content/blog/*.mdx */
export const postMetadataSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(300),
  date: isoDate,
  author: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(30)).max(6).default([]),
  /** Drafts are excluded from listings, the sitemap and static params. */
  draft: z.boolean().default(false),
});

export type PostMetadata = z.infer<typeof postMetadataSchema>;

export const ROLE_STATUSES = ["open", "draft", "closed"] as const;

/** `export const metadata` shape for content/careers/*.mdx */
export const roleMetadataSchema = z.object({
  title: z.string().trim().min(3).max(120),
  team: z.string().trim().min(2).max(60),
  location: z.string().trim().min(2).max(80),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  summary: z.string().trim().min(20).max(300),
  status: z.enum(ROLE_STATUSES),
  posted: isoDate,
});

export type RoleMetadata = z.infer<typeof roleMetadataSchema>;

/** Slugs come from filenames; keep them URL-safe. */
export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
