"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart, useUi } from "@/lib/stores";
import { Button, cn } from "@/components/ui/primitives";
import { QuantityStepper } from "@/components/cart/CartLineItem";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchase({ product }: { product: Product }) {
  const id = useId();
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const unavailable = product.availability === "unavailable";

  function onAdd() {
    const result = add(product.id, variantId, quantity);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setError(null);
    setAdded(true);
    setQuantity(1);
    setCartOpen(true);
    window.setTimeout(() => setAdded(false), 2400);
  }

  return (
    <div className="space-y-8">
      {product.variants && (
        <fieldset aria-describedby={error ? `${id}-error` : undefined}>
          <div className="flex items-baseline justify-between">
            <legend className="text-[0.9375rem] font-medium">{product.variants.name}</legend>
            <Link href="/journal/finding-your-signature-ring" className="link-line text-caption text-taupe hover:text-obsidian">
              Sizing advice
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {product.variants.options.map((o) => (
              <label
                key={o.id}
                className={cn(
                  "relative flex min-h-12 items-center justify-center border text-[0.875rem] tabular-nums transition-colors duration-150",
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-antique",
                  !o.available
                    ? "cursor-not-allowed border-line text-taupe/60 line-through"
                    : variantId === o.id
                      ? "cursor-pointer border-obsidian bg-obsidian text-ivory"
                      : "cursor-pointer border-line-strong hover:border-obsidian",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-variant`}
                  value={o.id}
                  checked={variantId === o.id}
                  disabled={!o.available}
                  onChange={() => {
                    setVariantId(o.id);
                    setError(null);
                  }}
                  className="sr-only"
                />
                <span aria-hidden="true">{o.label.replace(/^\D+\s/, "")}</span>
                <span className="sr-only">
                  {o.label}
                  {!o.available && ", unavailable"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-6">
        <span className="text-[0.9375rem] font-medium" id={`${id}-qty`}>
          Quantity
        </span>
        <QuantityStepper value={quantity} max={product.maxQuantity} onChange={setQuantity} label="Quantity" />
      </div>

      <div className="grid gap-3">
        <Button onClick={onAdd} disabled={unavailable} className="w-full" aria-describedby={error ? `${id}-error` : undefined}>
          {unavailable ? "Currently unavailable" : added ? "Added to your bag" : "Add to bag"}
        </Button>
        <WishlistButton productId={product.id} productName={product.name} variant="text" className="w-full" />
      </div>

      <p id={`${id}-error`} role="alert" className="-mt-4 min-h-[1.25rem] text-caption text-error">
        {error}
      </p>
    </div>
  );
}
