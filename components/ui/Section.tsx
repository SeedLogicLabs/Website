import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  /** Align the header left (default) or center. */
  align?: "left" | "center";
  /** Remove the top border rule. */
  flush?: boolean;
};

export function Section({
  eyebrow,
  title,
  lead,
  align = "left",
  flush = false,
  className,
  children,
  ...rest
}: SectionProps) {
  const hasHeader = eyebrow || title || lead;
  return (
    <section
      className={cn(
        "py-20 sm:py-28",
        !flush && "border-t border-line",
        className,
      )}
      {...rest}
    >
      <Container>
        {hasHeader ? (
          <div
            className={cn(
              "mb-12 max-w-2xl sm:mb-16",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {lead ? (
              <p className="mt-4 text-lg leading-8 text-muted">{lead}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
