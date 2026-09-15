/**
 * Product catalogue. This is the single source of truth for product pages,
 * cards, the sitemap, OG images and the waitlist product enum.
 * TODO(founder): review copy, statuses and feature lists.
 */

export const PRODUCT_SLUGS = [
  "pesapath",
  "id-scanner-sdk",
  "creature-codex",
  "online-cyber",
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export type ProductStatus = "in-development" | "research";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  "in-development": "In development",
  research: "Research phase",
};

export type Feature = { title: string; body: string };

export type DeveloperPreview = {
  intro: string;
  supportedDocuments: { name: string; note: string }[];
  steps: string[];
  snippet: { language: string; code: string };
};

export type Product = {
  slug: ProductSlug;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  status: ProductStatus;
  platform: string;
  audience: string;
  category: string;
  features: Feature[];
  /** Whether the product page offers a waitlist form. */
  waitlist: boolean;
  /** Optional developer-facing section (SDK products). */
  developer?: DeveloperPreview;
};

const sdkSnippet = [
  "// API preview, subject to change",
  "final scanner = IdScanner(projectKey: env.projectKey);",
  "",
  "final result = await scanner.verify(",
  "  documents: [DocumentType.nationalId, DocumentType.passport],",
  "  liveness: LivenessMode.active,",
  ");",
  "",
  "if (result.status == VerificationStatus.verified) {",
  "  await api.confirm(result.token); // server-side check",
  "}",
].join("\n");

export const products: Product[] = [
  {
    slug: "pesapath",
    name: "PesaPath",
    tagline: "See where your money goes, and where it could.",
    summary:
      "A personal finance app for budgeting, tracking income and expenses, setting goals and getting plain-language insights on your money.",
    description:
      "PesaPath turns the scattered reality of mobile money, bank transfers and cash into one clear picture. Build a budget in minutes, log what comes in and what goes out, set goals you can actually reach, and get insights that explain your habits instead of just charting them.",
    status: "in-development",
    platform: "Flutter (Android and iOS)",
    audience: "Individuals and households who want control over their money",
    category: "Personal finance",
    features: [
      {
        title: "Budgets that fit real life",
        body: "Monthly or custom periods, category limits, and gentle alerts before you overspend rather than after.",
      },
      {
        title: "Income and expense tracking",
        body: "Record transactions quickly, tag them, and see running totals per category and per goal.",
      },
      {
        title: "Goals and provisions",
        body: "Save toward school fees, rent, travel or an emergency fund with progress you can see.",
      },
      {
        title: "Insights in plain language",
        body: "Weekly summaries that tell you what changed and one thing to try next.",
      },
    ],
    waitlist: true,
  },
  {
    slug: "id-scanner-sdk",
    name: "ID Scanner SDK",
    tagline: "Identity verification that fits in your app.",
    summary:
      "An SDK for scanning national IDs, passports and driver licences with liveness detection, so businesses can verify customers without manual checks.",
    description:
      "ID Scanner SDK gives product teams a drop-in way to capture and read identity documents, confirm the person holding the document is live and present, and hand structured data back to your systems. It replaces photocopies, manual data entry and back-and-forth verification with a flow that takes seconds.",
    status: "in-development",
    platform: "Mobile SDK with a REST verification API",
    audience: "Businesses, fintechs and developers who onboard customers",
    category: "Identity and KYC",
    features: [
      {
        title: "Multi-document capture",
        body: "National IDs, passports and driver licences, with guided framing and glare detection.",
      },
      {
        title: "Liveness detection",
        body: "Confirms a real person is present at capture time to resist photos, screens and masks.",
      },
      {
        title: "Structured extraction",
        body: "Names, document numbers, dates and MRZ fields returned as typed JSON.",
      },
      {
        title: "Built for compliance",
        body: "Configurable retention, audit events and on-device pre-processing to minimise data movement.",
      },
    ],
    waitlist: true,
    developer: {
      intro:
        "The SDK is in active development. The interface below is an early preview of the integration shape and will change before release.",
      supportedDocuments: [
        { name: "National ID", note: "Front and back, with MRZ where present" },
        { name: "Passport", note: "ICAO 9303 MRZ, visual zone cross-check" },
        {
          name: "Driver licence",
          note: "Country-specific templates, expiry parsing",
        },
      ],
      steps: [
        "Add the SDK to your mobile app and initialise it with your project key.",
        "Launch the capture flow. The SDK guides the user through document and liveness capture.",
        "Receive a signed verification result in your app and confirm it server-side with the REST API.",
      ],
      snippet: { language: "dart", code: sdkSnippet },
    },
  },
  {
    slug: "creature-codex",
    name: "Creature Codex",
    tagline: "Stop only watching stories. Start making them.",
    summary:
      "A creative app for kids and adults who love anime and monster-collecting worlds: design characters, build a codex and tell your own stories.",
    description:
      "Most of us grew up as consumers of anime and pokemon-style universes. Creature Codex flips that. Design creatures and characters, give them lore and abilities, organise them into a codex, and turn them into illustrated stories you can share. It is a sketchbook, a world bible and a storytelling tool in one.",
    status: "in-development",
    platform: "Flutter (Android and iOS)",
    audience:
      "Young artists, fans and anyone who wants to create rather than only consume",
    category: "Creativity and storytelling",
    features: [
      {
        title: "Character and creature builder",
        body: "Draw or assemble creatures, set types, abilities and evolutions.",
      },
      {
        title: "Your own codex",
        body: "Catalogue everything you make with lore entries, regions and relationships.",
      },
      {
        title: "Story mode",
        body: "Turn codex entries into panelled, illustrated stories with simple templates.",
      },
      {
        title: "Made for young creators",
        body: "Age-appropriate defaults, offline drawing and no public chat.",
      },
    ],
    waitlist: true,
  },
  {
    slug: "online-cyber",
    name: "Online Cyber",
    tagline: "The cyber cafe, in your pocket.",
    summary:
      "Government and everyday digital services for Kenyans, from filing taxes to checking certificates, without the trip to a cyber cafe.",
    description:
      "Across Kenya, essential online services still mean a trip to a cyber cafe. Online Cyber is our research project into bringing those services to the phone people already have: filing returns, reviewing certificates, tracking applications and understanding what each step requires, in clear language.",
    status: "research",
    platform: "Mobile app (planned)",
    audience: "Kenyan citizens and small businesses",
    category: "Civic and e-government services",
    features: [
      {
        title: "Guided tax filing",
        body: "Step-by-step help for common returns with reminders before deadlines.",
      },
      {
        title: "Certificates and documents",
        body: "Review, download and verify official certificates from one place.",
      },
      {
        title: "Application tracking",
        body: "Know what stage your request is at and what is needed next.",
      },
      {
        title: "Built for low bandwidth",
        body: "Lightweight screens and offline guidance for when the network drops.",
      },
    ],
    waitlist: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function isProductSlug(value: string): value is ProductSlug {
  return (PRODUCT_SLUGS as readonly string[]).includes(value);
}
