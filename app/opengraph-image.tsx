import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: `${site.location.city}, ${site.location.country}`,
    title: "Engineered for growth.",
    subtitle:
      "Mobile products for money, identity and creativity: PesaPath, ID Scanner SDK, Creature Codex and Online Cyber.",
  });
}
