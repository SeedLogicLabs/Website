import type { DeveloperPreview as DeveloperPreviewData } from "@/content/products";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function DeveloperPreview({ data }: { data: DeveloperPreviewData }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <Reveal>
        <Badge tone="amber">API preview, subject to change</Badge>
        <p className="mt-4 text-base leading-7 text-muted">{data.intro}</p>

        <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Supported documents
        </h3>
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
          {data.supportedDocuments.map((d) => (
            <li key={d.name} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <span className="font-medium text-text">{d.name}</span>
              <span className="text-right text-muted">{d.note}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Integration flow
        </h3>
        <ol className="mt-3 space-y-3">
          {data.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm leading-6 text-muted">
              <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <ButtonLink href="/contact?interest=id-scanner-sdk" className="mt-8">
          Request a demo
        </ButtonLink>
      </Reveal>

      <Reveal delay={0.1}>
        <figure className="overflow-hidden rounded-2xl border border-line bg-ink shadow-glow">
          <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-xs text-faint">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </span>
            verify.{data.snippet.language}
          </figcaption>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-text/90">
            <code>{data.snippet.code}</code>
          </pre>
        </figure>
      </Reveal>
    </div>
  );
}
