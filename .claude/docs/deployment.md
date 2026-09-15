# Deployment and operations

Host: **Netlify** (free plan permits commercial use; Vercel Hobby does not). Database: **Neon Postgres**
(free tier). Analytics: **Cloudflare Web Analytics** beacon (free, cookieless).

## One-time setup

1. **Netlify site.** Import the GitHub repo. `netlify.toml` sets the build command and publish
   directory; Netlify auto-installs its Next.js runtime, do not pin it. Node version comes from
   `.nvmrc` (22).
2. **Environment variables** (Site settings → Environment variables). All three are read only on
   the server except the public beacon token:

   | Variable | Purpose | Notes |
   |---|---|---|
   | `DATABASE_URL` | Neon connection string | Server-only. Use the pooled or direct URL; neon-http works with either. |
   | `IP_HASH_SALT` | Salt for hashing visitor IPs | Generate with `openssl rand -hex 32`. Min 16 chars. Production **fails closed** without it (`lib/forms/ip-hash.server.ts:10`). |
   | `NEXT_PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics site token | Optional. Beacon is omitted when empty (`components/analytics/CfAnalytics.tsx`). |

3. **Database migration.** Migrations are generated from `lib/db/schema.ts` and committed under
   `drizzle/`. Apply them once per database:

   ```bash
   # .env.local holds DATABASE_URL locally; it is gitignored
   npm run db:migrate
   ```

   After changing the schema: `npm run db:generate`, review the SQL in `drizzle/`, commit, then
   `npm run db:migrate` against production.

4. **Custom domain.** Add `seedlogiclabs.com` in Netlify and enable HTTPS. `metadataBase`,
   canonical URLs and the sitemap all derive from `site.url` in `content/site.ts`.

## Every deploy

Netlify builds every push. CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, build and
Playwright on the same commit; treat a red CI as a blocked deploy even though Netlify does not wait
for it.

Deploy previews: Server Actions perform an Origin/Host check. Test both forms on the first preview
URL; if they fail there but work locally, the runtime is proxying with a mismatched host and
`experimental.serverActions.allowedOrigins` is the documented fix.

## Verifying a deploy

```bash
# Headers set in next.config.ts
curl -sI https://<deploy-url>/ | grep -iE "strict-transport|x-frame|x-content-type|referrer|permissions"

# Routes and content
curl -s https://<deploy-url>/sitemap.xml | grep -c "<loc>"

# Run the e2e suite against the deploy instead of a local server
PLAYWRIGHT_BASE_URL=https://<deploy-url> npx playwright test
```

Lighthouse: run in an incognito window against the production URL, mobile preset. Baseline at
handover was 95-96 performance and 100 accessibility, best practices and SEO.

## Data handling

- Only two tables store personal data (`lib/db/schema.ts`): waitlist emails and contact requests.
  IPs are stored as salted SHA-256 hashes, never raw.
- Read submissions in the Neon console (SQL editor). There is no admin UI by design.
- Rate limit is 5 submissions per hashed IP per rolling hour per table (`lib/db/leads.ts:9`).
- Prune old `ip_hash` rows manually now and then; there is no cron on the free tier:

  ```sql
  DELETE FROM contact_requests WHERE created_at < now() - interval '24 months';
  ```

- Never paste rows from these tables into issues, chats or prompts. They are personal data under
  the Kenya Data Protection Act, 2019.

## Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL for form testing; leave the rest blank
npm ci
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL`, pages work and forms validate, but submissions return the generic error.
Without `IP_HASH_SALT`, development uses a fixed salt and logs a warning.

Playwright runs on port 3100 because another local app commonly holds 3000
(`playwright.config.ts`). Set `E2E_DATABASE_URL` to a Neon branch to enable the happy-path form
tests; they are skipped otherwise.
