import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
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
  },
  {
    title: "Partnerships and press",
    body: "Working on something adjacent to money, identity or creativity in East Africa? Let us compare notes.",
  },
  {
    title: "Early access",
    body: "Want in on PesaPath, Creature Codex or Online Cyber before launch? Pick the product as the topic.",
  },
];

function FormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-raised" />
      ))}
      <div className="h-32 animate-pulse rounded-xl bg-raised" />
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us."
        lead={`We read everything and reply ourselves, from ${site.location.city}.`}
      />

      <Section flush className="pt-0 sm:pt-0">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <Card>
            <h2 className="text-xl font-semibold tracking-tight text-text">Send a message</h2>
            <p className="mt-1 text-sm text-muted">
              Demos, partnerships, early access or anything else.
            </p>
            <div className="mt-6">
              {/* ContactForm reads ?interest= on the client; Suspense keeps this route static. */}
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm />
              </Suspense>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block break-all text-xl font-semibold tracking-tight text-text hover:text-accent"
              >
                {site.email}
              </a>
              <p className="mt-3 text-sm leading-6 text-muted">
                {site.name}, {site.location.city}, {site.location.country}
              </p>
              <ul className="mt-5 flex gap-4 text-sm">
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

            <ul className="flex flex-col gap-4">
              {reasons.map((r) => (
                <li key={r.title} className="rounded-2xl border border-line bg-surface/50 p-5">
                  <h3 className="font-semibold tracking-tight text-text">{r.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
