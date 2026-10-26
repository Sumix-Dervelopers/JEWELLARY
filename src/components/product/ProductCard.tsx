import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { PriceDisplay, cn } from "@/components/ui/primitives";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
  preload = false,
  className,
}: {
  product: Product;
  sizes?: string;
  preload?: boolean;
  className?: string;
}) {
  const [primary, alternate] = product.images;
  const note = product.newArrival ? "New arrival" : product.availability === "made-to-order" ? "Made to order" : null;

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="zoom-frame relative aspect-[4/5] bg-parchment">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={sizes}
            placeholder="blur"
            preload={preload}
            className="object-cover"
          />
          {alternate && (
            <Image
              src={alternate.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 ease-[var(--ease-out)] group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </div>
        <div className="mt-4 pr-10">
          <h3 className="font-display text-[1.125rem] leading-snug md:text-[1.25rem]">{product.name}</h3>
          <p className="mt-1 text-caption text-taupe">
            {product.materials.metal}
            {product.materials.stones ? `, ${product.materials.stones.toLowerCase()}` : ""}
          </p>
          <PriceDisplay price={product.price} compareAt={product.compareAtPrice} className="mt-2 block text-[0.9375rem]" />
          {note && <p className="mt-1.5 text-micro tracking-[0.04em] text-antique">{note}</p>}
        </div>
      </Link>
      <WishlistButton productId={product.id} productName={product.name} className="absolute top-1.5 right-1.5 bg-ivory/80 backdrop-blur-[2px] hover:bg-ivory" />
    </article>
  );
}
