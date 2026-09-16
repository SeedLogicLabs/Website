import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import type { Organization, WithContext } from "schema-dts";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CfAnalytics } from "@/components/analytics/CfAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { THEME_COLOR, themeInitScript } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
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
  // No title/description/url here: child pages would inherit them and every
  // og:title would point at the home page. Next fills them from each page's
  // resolved title and description.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

// Follows the OS preference; a stored toggle choice does not update this meta.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
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
      // The init script sets data-theme before hydration.
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Applies the stored or OS theme before any content paints. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Without JavaScript, scroll-reveal blocks must still be readable and
            the theme toggle (which needs JS) is hidden. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-theme-toggle]{display:none}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
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
