@AGENTS.md

# SeedLogic Labs Website

## Project overview

Company website for SeedLogic Labs, a Nairobi product studio (tagline "Engineered for growth").
It presents four in-house products, none launched yet (PesaPath, ID Scanner SDK, Creature Codex,
Online Cyber), collects waitlist and demo leads into Postgres, and hosts an MDX blog and careers
section. Deployed on Netlify at https://seedlogiclabs.com. Copy the founder must review is
marked `TODO(founder)` in TS and `{/* founder: review */}` in MDX; Privacy and Terms are drafts
pending legal review.

## Tech stack

| Layer | Choice | Where |
|---|---|---|
| Framework | Next.js 16.3 App Router, Turbopack, `typedRoutes` | `next.config.ts` |
| UI | React 19.2, Server Components by default | `app/**` |
| Language | TypeScript 5 strict, `@/*` alias to repo root | `tsconfig.json:21` |
| Styling | Tailwind CSS v4, CSS-first tokens in `@theme`, dark-only | `app/globals.css:8` |
| Motion | `motion` (Framer Motion) in one client leaf | `components/motion/Reveal.tsx` |
| Content | TS data + MDX via `@next/mdx` with `export const metadata` | `content/`, `mdx-components.tsx` |
| Data | Drizzle ORM + `@neondatabase/serverless` (neon-http) | `lib/db/` |
| Validation | Zod 4 (server only) | `lib/validation/` |
| Analytics | Cloudflare Web Analytics beacon, token-gated | `components/analytics/CfAnalytics.tsx` |
| Tests | Vitest (jsdom) + Playwright (port 3100) | `vitest.config.mts`, `playwright.config.ts` |
| Hosting | Netlify (free plan allows commercial use), Node 22 | `netlify.toml`, `.nvmrc` |

Next.js 16 differs from older training data: read the matching guide under
`node_modules/next/dist/docs/` before framework work (index below).

## Key directories

- `app/` routes. Each dynamic segment has `generateStaticParams` + `dynamicParams = false`.
  Metadata files: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`.
  `app/actions/` holds the two Server Actions (`"use server"` + `server-only`).
- `components/ui` primitives · `layout` header/footer/logo · `marketing` page sections ·
  `forms` client forms · `motion` Reveal · `seo` JsonLd · `analytics` beacon.
- `content/` `site.ts` (company, nav, socials), `products.ts` (catalogue, `PRODUCT_SLUGS`),
  `blog/*.mdx`, `careers/*.mdx`.
- `lib/` `db/` (schema, lazy client, atomic insert SQL) · `forms/` (pipeline, state, IP hashing) ·
  `validation/` (Zod schemas, Zod-free `interests.ts`) · `content/` (MDX loaders, schemas) ·
  `og.tsx` (shared OG renderer) · `cn.ts`.
- `drizzle/` committed SQL migrations. `assets/fonts/` Geist TTF for OG images (OFL).
- `tests/e2e/` Playwright. Unit tests are colocated `*.test.ts(x)`.
- `.claude/docs/` extended docs (see below). `.next/`, `next-env.d.ts` are generated; never edit.

## Essential commands

```bash
npm ci                       # Node 22, see .nvmrc
npm run dev                  # http://localhost:3000
npm run lint                 # eslint .
npm run typecheck            # next typegen && tsc --noEmit (typegen first, or LayoutProps/PageProps are missing)
npm run test:run             # vitest run
npm run build && npm start   # production build (Turbopack) and server
npm run test:e2e             # playwright against a production build on port 3100 (run build first)
npm run db:generate          # drizzle-kit generate from lib/db/schema.ts
npm run db:migrate           # apply drizzle/ to DATABASE_URL (needs .env.local)
```

Gate before every commit: lint, typecheck, test:run, build, test:e2e all green. CI runs the same
(`.github/workflows/ci.yml`).

Environment (`.env.example`): `DATABASE_URL` (server), `IP_HASH_SALT` (server, min 16 chars,
production fails closed without it), `NEXT_PUBLIC_CF_BEACON_TOKEN` (optional). Never commit
`.env.local`; never log or paste form submissions, they are personal data.

## Working rules

- Keep pages Server Components; add `"use client"` only to small leaves (see patterns doc §1).
- Never import `server-only` modules (`lib/db/*`, `app/actions/*`, `lib/forms/ip-hash.server.ts`)
  from client components or Vitest tests.
- Keep Zod out of client bundles: client forms import constants from `lib/validation/interests.ts`
  and only types from the schema files.
- New product, post or role: edit `content/`, not components (`content_authoring.md`).
- Do not add `openGraph.title/description/url` to the root layout; children own them.
- Do not turn `/contact` into a dynamic route; `ContactForm` reads `?interest` client-side.
- Lighthouse on this machine is noisy; trust a run only if `environment.benchmarkIndex` in the
  JSON is above ~1500. Baseline: 93-96 performance, 100 for the other categories.
- `next dev` maintains the managed block in `AGENTS.md`; keep `@AGENTS.md` as line 1 here.

## Additional documentation

Project docs (`.claude/docs/`):
- `architectural_patterns.md` — server/client boundary, content-as-code, token pipeline, motion
  fallbacks, form pipeline and atomic rate limit, lazy DB, SEO conventions, testing layers.
- `content_authoring.md` — how to add posts, roles and products; metadata fields; voice rules.
- `deployment.md` — Netlify setup, env vars, Neon migration, verifying a deploy, data handling.

Bundled Next.js 16 docs (`node_modules/next/dist/docs/01-app/`):
- `01-getting-started/03-layouts-and-pages.md`, `05-server-and-client-components.md`
- `01-getting-started/07-mutating-data.md`, `02-guides/forms.md`, `02-guides/server-actions.md`,
  `02-guides/data-security.md` — Server Actions and `useActionState`
- `02-guides/mdx.md` — `@next/mdx`, dynamic imports, `export const metadata`
- `01-getting-started/14-metadata-and-og-images.md`, `03-api-reference/03-file-conventions/01-metadata/`
- `03-api-reference/05-config/02-typescript.md` — typegen, typed routes
- `02-guides/testing/vitest.md`, `playwright.md`
- `02-guides/upgrading/version-16.md` — breaking changes vs Next 13–15
