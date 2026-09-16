import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Read once at module scope; ImageResponse accepts ttf/otf/woff only.
const interSemiBold = readFile(
  join(process.cwd(), "assets/fonts/Inter-SemiBold.ttf"),
);

/**
 * Shared Open Graph renderer. Flexbox-only CSS (Satori has no grid).
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const fontData = await interSemiBold;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(250,108,18,0.28), transparent 70%), radial-gradient(40% 40% at 90% 20%, rgba(255,161,74,0.22), transparent 70%), #05082a",
          color: "#f4f5fb",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="25" r="3" stroke="#fa6c12" strokeWidth="2" />
            <path d="M8 25h5M19 25h5" stroke="#fa6c12" strokeWidth="2" strokeLinecap="round" />
            <circle cx="6" cy="25" r="1.5" fill="#fa6c12" />
            <circle cx="26" cy="25" r="1.5" fill="#fa6c12" />
            <path d="M16 22V11" stroke="#ffa14a" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 15c0-4.5 3.5-7.5 8-7.5 0 4.5-3.5 7.5-8 7.5Z" fill="#ffa14a" />
            <path d="M16 11c0-3.5-2.8-6-6.5-6 0 3.5 2.8 6 6.5 6Z" fill="#fa6c12" />
          </svg>
          <div style={{ display: "flex", fontSize: 30 }}>
            <span>SeedLogic</span>
            <span style={{ color: "#a4abc9", marginLeft: 10 }}>Labs</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#fa6c12",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 60 : 76,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "#a4abc9",
                maxWidth: 960,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8790b3",
          }}
        >
          <span>{site.tagline}</span>
          <span>{site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Inter", data: fontData, weight: 600, style: "normal" }],
    },
  );
}
