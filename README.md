# SeedLogic Labs website

Company site for SeedLogic Labs, a Nairobi product studio. Tagline: **Engineered for growth**.
Presents four in-house products (PesaPath, ID Scanner SDK, Creature Codex, Online Cyber),
collects waitlist and demo leads, and hosts a blog and careers section.

Live: https://seedlogiclabs.com (Netlify)

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Framer Motion (`motion`) · Drizzle ORM + Neon Postgres · MDX via `@next/mdx` ·
Vitest + Playwright · Cloudflare Web Analytics.

## Quick start

```bash
nvm use            # Node 22 (.nvmrc)
npm ci
cp .env.example .env.local   # optional: DATABASE_URL enables the forms locally
npm run dev        # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |
| `npm test` / `npm run test:run` | Vitest (watch / single run) |
| `npm run test:e2e` | Playwright against a production build on port 3100 |
| `npm run db:generate` / `npm run db:migrate` | Drizzle migrations from `lib/db/schema.ts` |

CI runs all of the above on every push (`.github/workflows/ci.yml`).

## Project layout

```
app/           routes, layouts, metadata files (sitemap, robots, OG images), Server Actions
components/    ui primitives · layout · marketing sections · forms · motion · seo · analytics
content/       site facts, product catalogue (TS) and blog/careers posts (MDX)
lib/           db (Drizzle + Neon), forms pipeline, validation (Zod), content loaders, OG renderer
drizzle/       committed SQL migrations
tests/e2e/     Playwright smoke and form tests
.claude/docs/  deeper docs: architecture, content authoring, deployment
```

## Editing content

Copy, products, posts and roles are files in `content/`. See
[`.claude/docs/content_authoring.md`](.claude/docs/content_authoring.md). Strings the founder
should review are marked `TODO(founder)`.

## Deploying

Netlify builds from the connected repo. Required environment variables and the database
migration steps are in [`.claude/docs/deployment.md`](.claude/docs/deployment.md).

## Data and privacy

Forms store the minimum needed to reply (email, product or topic, message) plus a salted
hash of the IP for rate limiting. Privacy and Terms pages are drafts pending legal review.
