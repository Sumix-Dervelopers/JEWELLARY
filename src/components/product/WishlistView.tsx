"use client";

import { getProductById } from "@/lib/catalog";
import { useStoresHydrated, useWishlist } from "@/lib/stores";
import type { Product } from "@/lib/types";
import { ArrowLink } from "@/components/ui/primitives";
import { ProductCard } from "./ProductCard";

export function WishlistView() {
  const hydrated = useStoresHydrated();
  const ids = useWishlist((s) => s.ids);
  const saved = ids.map(getProductById).filter((p): p is Product => !!p);

  if (!hydrated) return <div className="min-h-[24rem]" aria-busy="true" aria-label="Loading your wishlist" />;

  if (saved.length === 0) {
    return (
      <div className="max-w-lg py-10">
        <p className="display-sm">Nothing saved yet.</p>
        <p className="mt-3 text-taupe">
          Select the heart on any piece to keep it here. Your wishlist is stored on this device; no account is needed.
        </p>
        <ArrowLink href="/shop" className="mt-8">
          Explore the collection
        </ArrowLink>
      </div>
    );
  }

  return (
    <>
      <p className="text-caption text-taupe">
        {saved.length} saved {saved.length === 1 ? "piece" : "pieces"}, stored on this device
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {saved.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
