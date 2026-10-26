"use client";

import Link from "next/link";
import { getProductById } from "@/lib/catalog";
import { cartCount, cartSubtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart, useStoresHydrated } from "@/lib/stores";
import { ArrowLink, buttonClass } from "@/components/ui/primitives";
import { CartLineItem } from "./CartLineItem";

export function CartView() {
  const hydrated = useStoresHydrated();
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotal(lines, getProductById);

  if (!hydrated) {
    return <div className="min-h-[24rem]" aria-busy="true" aria-label="Loading your bag" />;
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-lg py-10">
        <p className="display-sm">Your bag is empty.</p>
        <p className="mt-3 text-taupe">Pieces you add will wait here, on this device, while you keep looking.</p>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-2">
          <ArrowLink href="/shop">Explore the collection</ArrowLink>
          <ArrowLink href="/wishlist" className="text-taupe hover:text-obsidian">
            Open your wishlist
          </ArrowLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <ul className="divide-y divide-line border-y border-line lg:col-span-7">
        {lines.map((line) => (
          <CartLineItem key={line.key} line={line} size="full" />
        ))}
      </ul>

      <aside aria-labelledby="summary-title" className="lg:col-span-4 lg:col-start-9">
        <div className="bg-parchment p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <h2 id="summary-title" className="font-display text-2xl">
            Summary
          </h2>
          <dl className="mt-6 space-y-3 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt>Items</dt>
              <dd className="tabular-nums">{cartCount(lines)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-taupe">
              <dt>Delivery</dt>
              <dd>Confirmed with your order</dd>
            </div>
          </dl>
          <div className="mt-6 flex items-baseline justify-between border-t border-line-strong pt-5">
            <span>Estimated total</span>
            <span className="font-display text-2xl tabular-nums">{formatPrice(subtotal)}</span>
          </div>
          <Link href="/checkout" className={buttonClass("dark", "mt-8 w-full")}>
            Continue to checkout
          </Link>
          <p className="mt-4 text-caption text-taupe">
            Checkout sends your bag to us as an order enquiry. No payment is taken on this site.
          </p>
        </div>
      </aside>
    </div>
  );
}
