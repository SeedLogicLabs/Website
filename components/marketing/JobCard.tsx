import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Role } from "@/lib/content/careers";

export function JobCard({ role }: { role: Role }) {
  return (
    <Card interactive className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{role.meta.team}</Badge>
          <Badge>{role.meta.type}</Badge>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
          <Link href={`/careers/${role.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
            {role.meta.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{role.meta.summary}</p>
        <p className="mt-2 font-mono text-xs text-faint">{role.meta.location}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
        View role <span aria-hidden>&rarr;</span>
      </span>
    </Card>
  );
}
