import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Read once at module scope; ImageResponse accepts ttf/otf/woff only.
const geistSemiBold = readFile(
  join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf"),
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
  const fontData = await geistSemiBold;
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
            "radial-gradient(60% 50% at 20% 0%, rgba(52,211,153,0.28), transparent 70%), radial-gradient(40% 40% at 90% 20%, rgba(34,211,238,0.22), transparent 70%), #070a0f",
          color: "#f3f5f7",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="25" r="3" stroke="#34d399" strokeWidth="2" />
            <path d="M8 25h5M19 25h5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="6" cy="25" r="1.5" fill="#34d399" />
            <circle cx="26" cy="25" r="1.5" fill="#34d399" />
            <path d="M16 22V11" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 15c0-4.5 3.5-7.5 8-7.5 0 4.5-3.5 7.5-8 7.5Z" fill="#22d3ee" />
            <path d="M16 11c0-3.5-2.8-6-6.5-6 0 3.5 2.8 6 6.5 6Z" fill="#34d399" />
          </svg>
          <div style={{ display: "flex", fontSize: 30 }}>
            <span>SeedLogic</span>
            <span style={{ color: "#9aa4b2", marginLeft: 10 }}>Labs</span>
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
                color: "#34d399",
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
                color: "#9aa4b2",
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
            color: "#7b8794",
          }}
        >
          <span>{site.tagline}</span>
          <span>{site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Geist", data: fontData, weight: 600, style: "normal" }],
    },
  );
}
