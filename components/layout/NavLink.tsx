"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Nav link with active state. Tiny client leaf; the header stays a Server Component. */
export function NavLink({
  href,
  children,
  className,
  activeClassName = "text-text",
  onClick,
}: {
  href: Route;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
