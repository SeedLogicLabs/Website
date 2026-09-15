# Architectural patterns and conventions

Scope note: the codebase currently has two React files (`app/layout.tsx`, `app/page.tsx`),
one stylesheet (`app/globals.css`) and four config files. Everything below is a
convention that is already visible across at least two of those files. There is no
dependency injection, state management, data layer, or API surface yet, so none is
documented here. Revisit this file once real components and routes exist.

## 1. Next.js App Router file conventions

- Routing is filesystem-based under `app/`. `app/page.tsx` is the `/` route;
  `app/layout.tsx` is the mandatory root layout that renders `<html>` and `<body>`
  (`app/layout.tsx:21-27`).
- Global CSS is imported exactly once, in the root layout (`app/layout.tsx:3`), never in
  pages or components.
- Static files live in `public/` and are referenced by absolute URL path
  (`app/page.tsx:9`, `app/page.tsx:50`).
- `app/favicon.ico` is picked up by the metadata file convention with no code.
- Site metadata is exported as a typed `metadata` constant from the layout
  (`app/layout.tsx:15-18`), not set via `<head>` tags.

Reference: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`.

## 2. Server Components by default

Neither `app/layout.tsx` nor `app/page.tsx` has a `"use client"` directive. Both are
React Server Components. Fonts, metadata, and static markup are all resolved on the
server. Add `"use client"` only to leaf components that need state, effects, or browser
APIs, and keep it out of layouts and pages.

Reference: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.

## 3. Typed routes and generated props

The root layout is typed with the Next-generated global `LayoutProps<"/">`
(`app/layout.tsx:20`) instead of a hand-written `{ children: React.ReactNode }` type.
These globals come from `.next/types/routes.d.ts`, pulled in through `next-env.d.ts`.
Consequences:

- Run `npx next typegen` before `npx tsc --noEmit` on a clean checkout.
- New pages and layouts should use `PageProps<"/path">` / `LayoutProps<"/path">` the
  same way, so route params stay in sync with the filesystem.

Reference: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md`.

## 4. Theming: a three-layer CSS-variable pipeline

Design tokens flow from the layout, through the stylesheet, into utility classes.
This is the one pattern that genuinely spans all three source files.

1. **Font variables are declared in the layout.** `next/font/google` is configured
   with `variable:` names (`app/layout.tsx:5-13`) and those class names are applied to
   `<html>` (`app/layout.tsx:24`), which puts `--font-geist-sans` and
   `--font-geist-mono` on the root element.
2. **`globals.css` maps raw variables to Tailwind tokens.** The `@theme inline` block
   (`app/globals.css:8-13`) exposes `--color-background`, `--color-foreground`,
   `--font-sans`, and `--font-mono` as Tailwind v4 theme values. Color sources are the
   plain `:root` variables at `app/globals.css:3-6`.
3. **Pages consume tokens only through utilities.** `font-sans` (`app/page.tsx:5`) and
   `bg-foreground text-background` (`app/page.tsx:43`) are the generated utilities.
   No component references a CSS variable or hex value directly for themed colors.

Rules that follow:

- Add new tokens in `@theme inline`, not in a `tailwind.config` file. Tailwind v4 is
  CSS-first and this project has no JS config (`postcss.config.mjs` is the only wiring).
- Fonts only apply where a `font-sans` / `font-mono` utility is present. The `body`
  rule in `app/globals.css:25` still falls back to Arial, so unstyled text is not Geist.

Reference: `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and `13-fonts.md`.

## 5. Dark mode via `prefers-color-scheme`

Two mechanisms are used together and must stay consistent:

- Token swap: `app/globals.css:15-20` overrides `--background` / `--foreground` under
  `@media (prefers-color-scheme: dark)`, so every `bg-background` / `text-foreground`
  utility flips automatically.
- Per-element variants: `dark:` utilities in `app/page.tsx` (lines 5, 6, 8, 16, 18, 23, 27, 34,
  43, 49, 58) handle one-off colors and `dark:invert` for monochrome SVG logos.

Tailwind v4's `dark:` variant also keys off `prefers-color-scheme` by default, so there
is no class-based theme toggle. Introducing one requires a `@custom-variant dark` in
`globals.css` and a decision about the media query at `app/globals.css:15`.

## 6. Images

Static images go through `next/image`, never a raw `<img>`:

- Source is a `public/` path, with explicit `width` and `height` (`app/page.tsx:7-14`,
  `app/page.tsx:48-54`).
- Above-the-fold images set `priority` (`app/page.tsx:13`).
- Sizing on screen is controlled with Tailwind classes, while `width`/`height` props
  only set the intrinsic ratio.

Reference: `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`.

## 7. Layout composition with flex columns

The root layout owns the page shell: `<html class="h-full">` and
`<body class="min-h-full flex flex-col">` (`app/layout.tsx:24-26`). Pages then stretch
with `flex-1` (`app/page.tsx:5-6`) rather than setting their own viewport heights.
Keep this contract when adding routes: the layout provides the column, the page fills it.

## 8. External links

Off-site anchors that open in a new tab use `target="_blank"` together with
`rel="noopener noreferrer"` (`app/page.tsx:45-46`, `app/page.tsx:60-61`). Internal
navigation should use `next/link` once there is more than one route.

## 9. Configuration is TypeScript / ESM

All config files are ES modules: `next.config.ts` (typed with `NextConfig`),
`eslint.config.mjs` (ESLint 9 flat config composed from `eslint-config-next` presets,
`eslint.config.mjs:5-16`), and `postcss.config.mjs`. Do not add CommonJS or legacy
`.eslintrc` files.

## 10. Path alias

`@/*` resolves to the repository root (`tsconfig.json:21-23`). Import from `@/app/...`
or a future `@/components/...` rather than using `../` chains. There is no `src/`
directory; if one is introduced, update the alias in the same change.

## Not present yet (do not assume)

- No `components/`, `lib/`, or `hooks/` directories.
- No data fetching, caching directives, Server Actions, or route handlers.
- No client state library or context providers.
- No environment variables in use (`.env*` is gitignored at `.gitignore:34`).
- No tests or test runner.
