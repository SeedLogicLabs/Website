/**
 * Merges with @types/mdx's `declare module "*.mdx"`. Content files export a
 * `metadata` object; it is typed as unknown here and validated with Zod in
 * lib/content at load time, so a typo in a post fails the build, not a reader.
 */
declare module "*.mdx" {
  export const metadata: unknown;
}
