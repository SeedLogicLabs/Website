import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { Route } from "next";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Required by @next/mdx at the project root. Typography comes from the
 * <Prose> wrapper around rendered MDX, so only behaviour is customised here.
 */
function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const internal = href.startsWith("/");
  if (internal) {
    return (
      <Link href={href as Route} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  a: Anchor,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
