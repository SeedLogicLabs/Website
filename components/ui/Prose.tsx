import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Long-form text styles for legal pages, blog posts and job descriptions.
 * Uses arbitrary variants so MDX output needs no extra classes.
 */
export function Prose({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "max-w-3xl text-base leading-7 text-muted",
        "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-text",
        "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mt-1.5",
        "[&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent-text-hover",
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_code]:rounded [&_code]:bg-raised [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-text",
        "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-line [&_pre]:bg-surface [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_hr]:my-10 [&_hr]:border-line",
        "[&_table]:mt-4 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:text-left [&_th]:text-text [&_td]:border-b [&_td]:border-line [&_td]:py-2",
        className,
      )}
      {...rest}
    />
  );
}
