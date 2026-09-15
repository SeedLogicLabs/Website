import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms that apply when you use the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "15 September 2026";

// TODO(founder): have legal counsel review before launch.
export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" lead="The ground rules for using this website." />
      <Container className="pb-24">
        <DraftNotice lastUpdated={LAST_UPDATED} />
        <Prose>
          <h2>Acceptance</h2>
          <p>
            By using <a href={site.url}>{site.url}</a> you agree to these terms. If you do not
            agree, please do not use the website. These terms cover the website only; each
            product will carry its own terms when it launches.
          </p>

          <h2>Products in development</h2>
          <p>
            Descriptions of PesaPath, ID Scanner SDK, Creature Codex and Online Cyber describe
            work in progress. Features, timelines, pricing and availability may change or be
            withdrawn. Joining a waitlist does not create an obligation on us to deliver a
            product or on you to buy one. Code samples marked as previews are illustrative and
            not a supported interface.
          </p>

          <h2>Using the website</h2>
          <p>
            You may browse the website and submit forms for their intended purpose. You must
            not attempt to gain unauthorised access, scrape personal data, submit automated or
            misleading form entries, or interfere with the website&apos;s operation.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The website, its design, text, graphics and the {site.name} name and logo belong to{" "}
            {site.name}. Product names are our trademarks or pending marks. You may not reuse
            them without written permission. Third-party names are the property of their
            owners.
          </p>

          <h2>Third-party links</h2>
          <p>
            Links to other sites are provided for convenience. We are not responsible for their
            content or practices.
          </p>

          <h2>No warranties and limitation of liability</h2>
          <p>
            The website is provided &ldquo;as is&rdquo; without warranties of any kind. To the
            extent permitted by law, {site.name} is not liable for any loss arising from your
            use of, or inability to use, the website.
          </p>

          <h2>Privacy</h2>
          <p>
            Our <a href="/privacy">Privacy Policy</a> explains how we handle personal data
            submitted through this website.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Republic of Kenya, and the courts of
            Kenya have exclusive jurisdiction over any dispute.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </Prose>
      </Container>
    </>
  );
}
