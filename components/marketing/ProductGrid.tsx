import { products } from "@/content/products";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {products.map((p, i) => (
        <li key={p.slug} className="flex">
          <Reveal delay={Math.min(i, 3) * 0.06} className="flex w-full">
            <ProductCard product={p} detailed={detailed} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
