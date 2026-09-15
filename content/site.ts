import type { Route } from "next";
import { products } from "./products";

/**
 * Company-wide facts used across layout, metadata, JSON-LD and footer.
 * TODO(founder): review every string in this file before launch.
 */
export const site = {
  name: "SeedLogic Labs",
  shortName: "SeedLogic",
  tagline: "Engineered for growth",
  description:
    "SeedLogic Labs is a Nairobi-based product studio building software for money, identity and creativity: PesaPath, ID Scanner SDK, Creature Codex and Online Cyber.",
  url: "https://seedlogiclabs.com",
  email: "hello@seedlogiclabs.com",
  location: {
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
  },
  founded: "2024", // TODO(founder): confirm founding year
  socials: [
    // TODO(founder): replace with the real company profiles.
    { label: "LinkedIn", href: "https://www.linkedin.com/company/seedlogic-labs" },
    { label: "X", href: "https://x.com/seedlogiclabs" },
  ],
} as const;

export type NavItem = { href: Route; label: string };

export const mainNav: NavItem[] = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Products",
    items: products.map((p) => ({
      href: `/products/${p.slug}` as Route,
      label: p.name,
    })),
  },
  {
    heading: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

/** Values shown on Home ("How we build") and About. */
export const principles = [
  {
    title: "Start from a real problem",
    body: "Every product began as a friction we hit ourselves: tracking money, verifying identity, making something instead of only consuming it.",
  },
  {
    title: "Build for the phone in hand",
    body: "Our users are mobile-first. We design for small screens, patchy networks and devices people already own.",
  },
  {
    title: "Ship quietly, then loudly",
    body: "We iterate with a small group before we launch. Waitlists are how you get in early.",
  },
  {
    title: "Treat data as a liability",
    body: "Money and identity are sensitive. We collect the minimum, encrypt what we keep, and say plainly what we do with it.",
  },
] as const;
