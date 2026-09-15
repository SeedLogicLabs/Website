import Script from "next/script";

/**
 * Cloudflare Web Analytics beacon. Cookieless, no personal data, so no
 * consent banner is required. Renders nothing unless a token is configured.
 */
export function CfAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
