import { Card } from "@/components/ui/Card";

// TODO(founder): replace placeholders with real names, roles and photos.
const team = [
  { name: "Founder", role: "Founder and Engineering", initials: "SL" },
  { name: "Team member", role: "Mobile Engineering (Flutter)", initials: "TM" },
  { name: "Team member", role: "Design and Product", initials: "TM" },
];

export function TeamGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((m, i) => (
        <li key={`${m.name}-${i}`}>
          <Card className="flex items-center gap-4 p-5">
            <span
              aria-hidden
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-gradient font-mono text-sm font-semibold text-on-accent"
            >
              {m.initials}
            </span>
            <div>
              <p className="font-medium text-text">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
