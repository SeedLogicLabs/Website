import { principles } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export function PrinciplesGrid() {
  return (
    <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
      {principles.map((p, i) => (
        <li key={p.title}>
          <Reveal delay={Math.min(i, 3) * 0.06}>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-xs text-accent">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-text">
                {p.title}
              </h3>
            </div>
            <p className="mt-3 pl-11 text-sm leading-6 text-muted">{p.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
