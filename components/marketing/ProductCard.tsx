import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import type { Product } from "@/content/products";

export function ProductCard({
  product,
  detailed = false,
}: {
  product: Product;
  detailed?: boolean;
}) {
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            {product.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-text">
            <Link
              href={`/products/${product.slug}`}
              className="after:absolute after:inset-0 after:rounded-2xl"
            >
              {product.name}
            </Link>
          </h3>
        </div>
        <StatusBadge status={product.status} />
      </div>
      <p className="mt-3 text-base font-medium text-text/90">{product.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {detailed ? product.description : product.summary}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-xs">
        <div>
          <dt className="font-mono uppercase tracking-wider text-faint">Platform</dt>
          <dd className="mt-1 text-muted">{product.platform}</dd>
        </div>
        <div>
          <dt className="font-mono uppercase tracking-wider text-faint">For</dt>
          <dd className="mt-1 text-muted">{product.audience}</dd>
        </div>
      </dl>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Learn more <span aria-hidden>&rarr;</span>
      </span>
    </Card>
  );
}
