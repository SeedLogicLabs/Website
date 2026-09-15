import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects personal data on this website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "15 September 2026";

// TODO(founder): have legal counsel review against the Kenya Data Protection Act, 2019
// and the Office of the Data Protection Commissioner registration requirements.
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lead="What we collect on this website, why, and the choices you have." />
      <Container className="pb-24">
        <DraftNotice lastUpdated={LAST_UPDATED} />
        <Prose>
          <h2>Who we are</h2>
          <p>
            {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a software company based in{" "}
            {site.location.city}, {site.location.country}. This policy covers the website at{" "}
            <a href={site.url}>{site.url}</a>. Our products (PesaPath, ID Scanner SDK, Creature
            Codex and Online Cyber) will have their own privacy notices when they launch.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Waitlist sign-ups:</strong> your email address and the product you are
              interested in.
            </li>
            <li>
              <strong>Contact and demo requests:</strong> your name, email address, company
              (optional), the topic you selected and your message.
            </li>
            <li>
              <strong>Abuse prevention:</strong> a one-way hash of your IP address, stored with
              each submission for a limited time so we can rate-limit spam. We do not store the
              IP address itself.
            </li>
            <li>
              <strong>Analytics:</strong> we use Cloudflare Web Analytics, which is cookieless
              and does not collect personal data or track you across sites. It reports page
              views, referrers, device class and Core Web Vitals in aggregate.
            </li>
          </ul>
          <p>We do not use advertising cookies or sell personal data.</p>

          <h2>Why we collect it and on what basis</h2>
          <p>
            We process waitlist and contact data to respond to you and to tell you about the
            product you asked about. Under the Kenya Data Protection Act, 2019 we rely on your
            consent, which you give when you submit a form, and on our legitimate interest in
            keeping the website secure.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li>Waitlist entries: until the product launches and you are notified, or until you ask us to delete them.</li>
            <li>Contact requests: up to 24 months after our last exchange.</li>
            <li>Hashed IP records: up to 30 days.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            Data is stored with Neon (database hosting) and served through Netlify (website
            hosting). Analytics are processed by Cloudflare. Each acts as a processor under
            contract and may store data outside Kenya. We do not share your data with anyone
            else unless the law requires it.
          </p>

          <h2>Security</h2>
          <p>
            Data is encrypted in transit (TLS) and at rest. Access is limited to the people who
            need it to respond to you. We validate and rate-limit every form to reduce abuse.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us to access, correct, port or delete your personal data, or withdraw
            consent, at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
            You may also lodge a complaint with the Office of the Data Protection Commissioner
            of Kenya.
          </p>

          <h2>Children</h2>
          <p>
            This website is not directed at children under 18 and we do not knowingly collect
            their data here. Creature Codex, which is designed for younger creators, will have
            its own age-appropriate notice.
          </p>

          <h2>Changes</h2>
          <p>
            We will post any changes on this page and update the date above. Material changes
            will be announced on the website.
          </p>
        </Prose>
      </Container>
    </>
  );
}
