# Architectural patterns and conventions

Patterns that recur across the codebase. Each one names the files that establish it so you can
copy the shape rather than invent a new one. See also `content_authoring.md` and `deployment.md`.

## 1. Static-first App Router; client code only at the leaves

Every route under `app/` is a prerendered Server Component (`next build` shows `○`/`●` for all of
them). Client Components carry `"use client"` at the top and are small leaves:

- `components/layout/MobileNav.tsx`, `NavLink.tsx` (state, `usePathname`)
- `components/forms/WaitlistForm.tsx`, `ContactForm.tsx`, `SubmitButton.tsx` (`useActionState`,
  `useFormStatus`)
- `components/motion/Reveal.tsx` (Framer Motion)
- `app/error.tsx`, `app/global-error.tsx`

Rules that follow:
- A Server Component passes server-rendered content into a client leaf via `children`
  (`Reveal` wraps cards; the header stays a Server Component and only `MobileNav` is client).
- Request-time data that would make a route dynamic is read on the client instead:
  `ContactForm` reads `?interest=` with `useSearchParams` inside a `<Suspense>` in
  `app/contact/page.tsx`, so `/contact` stays static. Do not convert it to `searchParams`.
- `cacheComponents` is off. No `dynamic`/`revalidate` exports are needed.

## 2. Content as code, validated at build time

There is no CMS. Two kinds of content:

- **Typed TS data** for stable structures: `content/site.ts` (company, nav, socials, principles)
  and `content/products.ts` (`Product[]`, `PRODUCT_SLUGS`). Pages, cards, sitemap, OG images and
  the form enums all read from these; `content/products.test.ts` guards their invariants.
- **MDX files** for long-form: `content/blog/*.mdx`, `content/careers/*.mdx`. Each file starts with
  `export const metadata = {...}` (the native `@next/mdx` approach, no frontmatter plugins).
  Loaders in `lib/content/blog.ts` and `lib/content/careers.ts` list the directory with `fs`,
  import each module with a literal-prefix dynamic import
  (`import(\`@/content/blog/${slug}.mdx\`)`), and validate `metadata` with the Zod schemas in
  `lib/content/schemas.ts`. Invalid metadata throws, which fails `next build`.
- Publication state is data: `draft: true` on posts, `status !== "open"` on roles. Those items are
  excluded from listings, the sitemap and `generateStaticParams`, and their URLs 404.

Dynamic segments always ship `generateStaticParams` + `export const dynamicParams = false`
(`app/products/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/careers/[slug]/page.tsx`).

## 3. Design tokens flow layout → globals.css → utilities

- `app/layout.tsx` loads Inter and Geist Mono with `next/font` `variable:` names and puts them on
  `<html>`.
- `app/globals.css` declares every color, font, radius and shadow inside `@theme` (Tailwind v4 is
  CSS-first; there is no `tailwind.config`). Custom utilities (`text-gradient`,
  `bg-accent-gradient`, `bg-dot-grid`, `bg-hero-glow`, `animate-rise`) are defined with
  `@utility` in the same file.
- Components use only generated utilities (`bg-ink`, `text-muted`, `border-line`, `font-mono`).
  No hex values in TSX, except the OG renderer (`lib/og.tsx`) and `app/global-error.tsx`, which
  cannot use the stylesheet.
- The site is dark-only: `color-scheme: dark` on `:root`; there is no light theme or toggle.
- Contrast is part of the token set: `--color-faint` is the dimmest text allowed on `ink`
  (6.2:1; 4.9:1 on `raised`). Buttons on the accent gradient use `text-ink` (6.7:1 on orange);
  white on orange is only 2.7:1, so never put `text-text` on accent surfaces.
  Brand colors: primary orange `#fa6c12` (`accent`), secondary navy `#0a1045` (`surface`, with
  `ink` and `raised` derived darker and lighter in the same hue). `amber` marks research-phase
  and draft states so it stays distinct from the orange accent.

## 4. Motion is progressive enhancement

- Above the fold uses CSS-only `animate-rise` so LCP text exists in server HTML and never waits
  for hydration (`components/marketing/Hero.tsx`, `components/ui/PageHeader.tsx`).
- Below the fold uses `components/motion/Reveal.tsx`: `LazyMotion` + `domAnimation` + `m.div`,
  `whileInView` once. Props are identical on server and client (no hydration mismatch).
- Two fallbacks make hidden-on-server content safe: `[data-reveal]` is forced visible under
  `prefers-reduced-motion` in `globals.css`, and under `<noscript>` in `app/layout.tsx`.
  `tests/e2e/navigation.spec.ts` asserts the reduced-motion case.
- Never JS-animate an LCP candidate; never pass functions (easings, callbacks) from a Server
  Component into `Reveal`.

## 5. Forms: Server Action → shared pipeline → atomic SQL

- Actions live in `app/actions/*.ts` with `"use server"` and `import "server-only"`. Signature is
  `(prevState, formData)` for `useActionState`. They return `ActionState`
  (`lib/forms/state.ts`), never throw.
- Both actions delegate to `runFormPipeline` in `lib/forms/pipeline.ts`, which is pure and takes
  its side effects as `deps` (`ipHash`, `insert`, `limit`, `log`). Order is fixed: honeypot →
  Zod `safeParse` → IP hash → insert. Validation failures return before any env or DB access.
- Untrusted input includes hidden fields: `product` and `interest` are Zod enums derived from
  `PRODUCT_SLUGS` (`lib/validation/waitlist.ts`, `lib/validation/contact.ts`).
- Rate limiting is one SQL statement (CTE count + conditional insert) in `lib/db/leads.ts`
  because neon-http has no transactions. It returns `recent_count` and `inserted`; the pipeline
  maps `recent_count >= limit` to "try later" and `inserted = 0` to a silent success so the list
  cannot be probed for existing emails.
- Client forms (`components/forms/*`) render `Honeypot`, `FormStatus`, `ConsentNote` and
  `SubmitButton`; on error the action echoes `values` so inputs keep what the user typed.
- Constants a client form needs are kept in Zod-free modules (`lib/validation/interests.ts`) so
  Zod stays out of the client bundle. Only types are imported from `lib/validation/*.ts` on the
  client.

## 6. Database access is lazy and server-only

- `lib/db/client.ts` builds the Drizzle client inside `getDb()` on first use; nothing reads
  `DATABASE_URL` at import time, so `next build` works without it.
- Modules that must never reach the browser start with `import "server-only"`
  (`lib/db/*`, `lib/forms/ip-hash.server.ts`, `app/actions/*`). Consequently nothing under Vitest
  may import them; unit tests target the pure pipeline, schemas and helpers instead.
- Schema is `lib/db/schema.ts`; migrations are generated (`npm run db:generate`) and committed
  under `drizzle/`. Personal data is minimised: emails, topic, message, salted IP hash only.
- The IP used for rate limiting comes from Netlify's `x-nf-client-connection-ip`; forgeable
  `x-forwarded-for` is only trusted outside production (`lib/forms/ip.ts`).

## 7. SEO and metadata conventions

- Root `app/layout.tsx` sets `metadataBase`, a `title.template`, and only shared Open Graph fields
  (`type`, `siteName`, `locale`). It deliberately omits `openGraph.title/description/url` so child
  pages own theirs.
- Every page exports `metadata` or `generateMetadata` with `alternates.canonical`.
- Structured data is a native `<script type="application/ld+json">` via
  `components/seo/JsonLd.tsx` (escapes `<`), typed with `schema-dts`: Organization in the layout,
  SoftwareApplication per product, BlogPosting per post, JobPosting per role.
- OG images are generated at build by `opengraph-image.tsx` files that all call
  `renderOgImage` in `lib/og.tsx` (flexbox-only, one bundled TTF from `assets/fonts/`).
- `app/sitemap.ts` exports `allRoutes()` (fixed routes) for tests and an async default that adds
  content routes. `app/robots.ts` points at it.

## 8. Typed routes

`typedRoutes: true` in `next.config.ts`. Internal links use `next/link` with literal or template
hrefs; navigation data is typed as `{ href: Route; label }` in `content/site.ts`, and the single
`as Route` cast lives there. Use `ButtonLink` for internal, `ButtonAnchor` for external or
`mailto:` targets (`components/ui/Button.tsx`).

## 9. Security defaults

- Security headers are set once in `next.config.ts` `headers()` and asserted in
  `tests/e2e/routes.spec.ts`.
- External anchors always get `target="_blank" rel="noopener noreferrer"` (handled in
  `ButtonAnchor` and `mdx-components.tsx`).
- Analytics is the cookieless Cloudflare beacon, rendered only when its token env var exists
  (`components/analytics/CfAnalytics.tsx`). No consent banner is needed and no form data is sent.
- Logging in actions is event-name plus non-PII metadata; never the payload.

## 10. Testing layers

- **Vitest** (`*.test.ts(x)` colocated, jsdom): schemas, pipeline with fake deps, IP handling,
  content invariants, small component renders. Nothing that imports `server-only` modules.
- **Playwright** (`tests/e2e`, desktop + Pixel 7 projects, port 3100): every fixed route renders
  with one `h1` and no console errors; content routes are discovered from the live sitemap;
  form validation errors; happy-path form tests run only with `E2E_DATABASE_URL`.
- Lighthouse is run manually against `next start` (see `deployment.md`).

## Not present, by design

No light theme, no CMS, no admin UI for submissions, no client-side data fetching, no global
state library, no i18n, no `proxy.ts`/middleware, no `output: 'export'`.
