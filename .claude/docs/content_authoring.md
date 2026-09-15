# Content authoring

All marketing copy lives in the repo. No CMS. Edit, commit, and Netlify redeploys.

## Where things live

| Content | File(s) | Rendered by |
|---|---|---|
| Company facts, nav, socials, principles | `content/site.ts` | layout, footer, JSON-LD, Home, About |
| Products (cards, detail pages, waitlist enum, OG images) | `content/products.ts` | `app/products/**`, `components/marketing/ProductCard.tsx`, `lib/validation/*` |
| Blog posts | `content/blog/<slug>.mdx` | `app/blog/**`, `components/marketing/PostCard.tsx`, `LatestPost.tsx` |
| Job listings | `content/careers/<slug>.mdx` | `app/careers/**`, `components/marketing/JobCard.tsx` |
| Legal drafts | `app/privacy/page.tsx`, `app/terms/page.tsx` | themselves |
| Team placeholders | `components/marketing/TeamGrid.tsx` | About |

Every string the founder should review is marked `TODO(founder)` in TS files and
`{/* founder: review */}` in MDX. `grep -rn "TODO(founder)\|founder: review" content components app`.

## Add a blog post

1. Create `content/blog/<kebab-slug>.mdx`. The filename becomes the URL (`/blog/<kebab-slug>`), so it must match `^[a-z0-9]+(-[a-z0-9]+)*$` (`lib/content/schemas.ts:37`).
2. Start the file with the metadata export. Every field is validated at build time by `postMetadataSchema` (`lib/content/schemas.ts:9`); a bad value fails `next build`, not the reader.

   ```mdx
   export const metadata = {
     title: "Post title",                 // 3-120 chars
     description: "One or two sentences", // 20-300 chars, used for SEO and cards
     date: "2026-09-15",                  // YYYY-MM-DD
     author: "SeedLogic Labs",
     tags: ["company"],                   // up to 6
     draft: false,                        // true hides it everywhere
   };
   ```
3. Write the body in Markdown. Do not add an `# H1`; the page renders the title. Use `##` for sections. Internal links (`/products/pesapath`) become client-side navigations via `mdx-components.tsx`; external links open in a new tab.
4. Run `npm run build`. The post appears on `/blog`, the Home teaser, the sitemap and gets an OG image automatically.

Drafts (`draft: true`) are excluded from listings, sitemap and static params, and their URL returns 404 (`lib/content/blog.ts:44`).

## Add or publish a job listing

1. Create `content/careers/<kebab-slug>.mdx`, or copy `content/careers/flutter-engineer.mdx`.
2. Metadata is validated by `roleMetadataSchema` (`lib/content/schemas.ts:24`):
   `title`, `team`, `location`, `type` (`Full-time` | `Part-time` | `Contract` | `Internship`), `summary`, `status`, `posted` (YYYY-MM-DD).
3. `status` controls publication: only `"open"` roles appear on `/careers`, in the sitemap and at `/careers/<slug>`. `"draft"` and `"closed"` roles keep their file but return 404 (`lib/content/careers.ts:60`). To close a role, change the status; do not delete the file until you no longer want the URL to 404 cleanly.
4. Applications go to `hello@` via the mailto button; the subject is `Application: <title>`.

## Add or change a product

Edit the `products` array in `content/products.ts`. The `slug` feeds the route, the sitemap, the OG image, the footer and the waitlist and contact enums (`PRODUCT_SLUGS`, `content/products.ts:7`), so renaming a slug changes URLs and requires a redirect. Set `waitlist: false` to hide the form on that product's page. Only products with a `developer` block render the integration preview section (`app/products/[slug]/page.tsx`).

`content/products.test.ts` enforces unique slugs, valid statuses, a minimum of three features, and that every nav link points to a published route. Run `npm run test:run` after editing.

## Voice and rules

- Plain English, short sentences, no jargon on consumer pages. Technical detail is fine on the SDK page and blog.
- Status labels must be honest: `in-development` or `research`. Do not describe unreleased features as available.
- Never commit the company to dates, prices or SLAs on the site unless the founder supplied them.
- Legal pages are drafts until reviewed; keep the `DraftNotice` until counsel signs off, then remove it and update `LAST_UPDATED`.
