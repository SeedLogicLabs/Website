import { getProduct, products, STATUS_LABEL } from "@/content/products";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  return renderOgImage({
    eyebrow: product ? `${product.category} · ${STATUS_LABEL[product.status]}` : "Products",
    title: product?.name ?? "Products",
    subtitle: product?.tagline,
  });
}
