import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Organization, WithContext } from "schema-dts";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CfAnalytics } from "@/components/analytics/CfAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: `${site.name} | ${site.tagline}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "SeedLogic Labs",
    "Nairobi startup",
    "PesaPath",
    "ID Scanner SDK",
    "Creature Codex",
    "Online Cyber",
    "fintech Kenya",
    "identity verification SDK",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_KE",
    url: "/",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

const organization: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/opengraph-image`,
  slogan: site.tagline,
  description: site.description,
  email: site.email,
  foundingDate: site.founded,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressCountry: site.location.countryCode,
  },
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Without JavaScript, scroll-reveal blocks must still be readable. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={organization} />
        <CfAnalytics />
      </body>
    </html>
  );
}
