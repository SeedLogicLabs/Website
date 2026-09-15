import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonAnchor } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${site.name} about the ID Scanner SDK, partnerships or early access to our apps.`,
  alternates: { canonical: "/contact" },
};

const reasons = [
  {
    title: "Request an SDK demo",
    body: "Evaluating identity verification for onboarding? We will walk you through the ID Scanner SDK and its roadmap.",
    subject: "ID Scanner SDK demo",
  },
  {
    title: "Partnerships and press",
    body: "Working on something adjacent to money, identity or creativity in East Africa? Let us compare notes.",
    subject: "Partnership",
  },
  {
    title: "Early access",
    body: "Want in on PesaPath, Creature Codex or Online Cyber before launch? Tell us which and why.",
    subject: "Early access",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us."
        lead={`We read everything. Expect a reply from a human in ${site.location.city} within a few working days.`}
      />

      <Section flush className="pt-0 sm:pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            {/* Phase 2 adds the contact form here. */}
            <Card>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block text-2xl font-semibold tracking-tight text-text hover:text-accent"
              >
                {site.email}
              </a>
              <p className="mt-4 text-sm leading-6 text-muted">
                {site.name}, {site.location.city}, {site.location.country}
              </p>
              <ul className="mt-6 flex gap-4 text-sm">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted underline underline-offset-4 hover:text-text"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <ul className="grid gap-4">
            {reasons.map((r) => (
              <li key={r.title}>
                <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-text">{r.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{r.body}</p>
                  </div>
                  <ButtonAnchor
                    href={`mailto:${site.email}?subject=${encodeURIComponent(r.subject)}`}
                    variant="secondary"
                    className="shrink-0"
                  >
                    Email us
                  </ButtonAnchor>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
