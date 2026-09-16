import type { Feature } from "@/content/products";
import { Reveal } from "@/components/motion/Reveal";

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {features.map((f, i) => (
        <li key={f.title} className="bg-surface p-6 sm:p-8">
          <Reveal delay={Math.min(i, 3) * 0.05}>
            <span className="font-mono text-xs text-accent-text">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-text">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{f.body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
