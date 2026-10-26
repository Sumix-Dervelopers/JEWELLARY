import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

/**
 * Server-rendered grid used as the prerendered shell for pages whose filters come from the URL.
 * Crawlers and no-JS visitors get real content; the interactive browser replaces it on load.
 */
export function StaticGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="hidden lg:col-span-3 lg:block" />
      <div className="lg:col-span-9">
        <div className="border-b border-line pb-4">
          <p className="min-h-11 py-3 text-caption text-taupe">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:gap-x-6">
          {products.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} preload={i < 2} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
