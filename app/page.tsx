import Link from "next/link";
import { Hero } from "@/components/marketing/Hero";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { PrinciplesGrid } from "@/components/marketing/PrinciplesGrid";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        id="products"
        eyebrow="Products"
        title="Four problems we are building through."
        lead={
          <>
            Everything here is built in-house and still in progress. Join a
            waitlist to get in early, or{" "}
            <Link href="/contact" className="text-accent underline underline-offset-4 hover:text-accent-2">
              talk to us
            </Link>{" "}
            about the SDK.
          </>
        }
      >
        <ProductGrid />
        <div className="mt-10">
          <ButtonLink href="/products" variant="secondary">
            See all products
          </ButtonLink>
        </div>
      </Section>

      <Section
        eyebrow="How we build"
        title="Small team, real problems, careful with data."
        lead="The principles that decide what we build and how."
      >
        <PrinciplesGrid />
      </Section>

      <Section eyebrow="About" title={<>Built in {site.location.city}.</>}>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-lg leading-8 text-muted">
              {site.name} is a product studio in {site.location.city},{" "}
              {site.location.country}. We started by building the tools we
              wished existed for our own money, our own onboarding flows and our
              own creative side projects. Each one grew into a product with a
              name.
            </p>
            <p className="mt-5 text-lg leading-8 text-muted">
              We are early. That means fast iteration, honest status labels and
              a lot of listening to the people on our waitlists.
            </p>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              More about us
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="grid grid-cols-2 gap-5">
              {[
                { k: "Products in development", v: "3" },
                { k: "In research", v: "1" },
                { k: "Home base", v: site.location.city },
                { k: "Mobile stack", v: "Flutter" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-line bg-surface p-5">
                  <dt className="font-mono text-xs uppercase tracking-wider text-faint">{s.k}</dt>
                  <dd className="mt-2 text-2xl font-semibold tracking-tight text-text">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
