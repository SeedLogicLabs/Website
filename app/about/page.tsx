import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { PrinciplesGrid } from "@/components/marketing/PrinciplesGrid";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a ${site.location.city}-based product studio building software for money, identity and creativity.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>A product studio in {site.location.city}.</>}
        lead="We build the tools we wished existed, then open them to the people who need them most."
      />

      <Section flush className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-text">Our story</h2>
            {/* TODO(founder): replace with the real origin story. */}
            <p className="mt-4 text-base leading-7 text-muted">
              {site.name} started as a set of side projects. We were tracking
              our own money in spreadsheets, watching businesses photocopy IDs
              to onboard customers, and noticing that the kids around us could
              name a hundred anime characters but had never drawn one of their
              own. Each of those frictions became a prototype, and the
              prototypes became a studio.
            </p>
            <p className="mt-4 text-base leading-7 text-muted">
              Today we are a small team building four products in parallel,
              sharing one design language, one mobile stack and one rule: ship
              the smallest thing that makes someone&apos;s day easier, then
              listen.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold tracking-tight text-text">Mission</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Growth is our word for what good software should do for people:
              help them understand their money, prove who they are without
              friction, make things they are proud of, and reach services that
              used to need a queue. That is what &ldquo;{site.tagline}&rdquo;
              means to us.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Products", "4 in progress"],
                ["Based in", `${site.location.city}, ${site.location.country}`],
                ["Focus", "Mobile-first products"],
                ["Stage", "Pre-launch"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="font-mono text-xs uppercase tracking-wider text-faint">{k}</dt>
                  <dd className="mt-1 font-medium text-text">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Values" title="How we build.">
        <PrinciplesGrid />
      </Section>

      <Section
        eyebrow="Team"
        title="Small by design."
        lead="Engineers and designers who ship. Full profiles are coming soon."
      >
        <TeamGrid />
        <div className="mt-8">
          <ButtonLink href="/careers" variant="secondary">
            Work with us
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
