import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}
      {...rest}
    />
  );
}
