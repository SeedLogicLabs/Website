import type { Thing, WithContext } from "schema-dts";

/**
 * Structured data as a native script tag (the Metadata API does not support
 * script tags). `<` is escaped so user-influenced strings cannot break out.
 */
export function JsonLd({ data }: { data: WithContext<Thing> | WithContext<Thing>[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
