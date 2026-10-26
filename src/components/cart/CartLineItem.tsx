"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/stores";
import { cn } from "@/components/ui/primitives";

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  min = 1,
}: {
  value: number;
  max: number;
  min?: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const btn =
    "pressable grid size-10 place-items-center text-obsidian transition-colors hover:bg-parchment disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line-strong">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus size={14} strokeWidth={1.25} />
      </button>
      <output className="w-9 text-center text-[0.9375rem] tabular-nums" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus size={14} strokeWidth={1.25} />
      </button>
    </div>
  );
}

export function CartLineItem({ line, onNavigate, size = "compact" }: { line: CartLine; onNavigate?: () => void; size?: "compact" | "full" }) {
  const product = getProductById(line.productId);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  if (!product) return null;

  const variant = product.variants?.options.find((o) => o.id === line.variantId);
  const href = `/products/${product.slug}`;

  return (
    <li className="flex gap-5 py-6">
      <Link
        href={href}
        onClick={onNavigate}
        className={cn("relative block shrink-0 bg-parchment", size === "full" ? "aspect-[4/5] w-28 md:w-36" : "aspect-[4/5] w-24")}
      >
        <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="144px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="font-display text-lg leading-snug hover:text-antique">
              {product.name}
            </Link>
            {variant && <p className="mt-0.5 text-caption text-taupe">{variant.label}</p>}
            {product.availability === "made-to-order" && <p className="mt-0.5 text-caption text-taupe">Made to order</p>}
          </div>
          <p className="shrink-0 text-[0.9375rem] tabular-nums">{formatPrice(product.price * line.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantityStepper
            value={line.quantity}
            max={product.maxQuantity}
            onChange={(q) => setQuantity(line.key, q)}
            label={`Quantity of ${product.name}`}
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="link-line text-caption text-taupe hover:text-obsidian"
          >
            Remove<span className="sr-only"> {product.name}</span>
          </button>
        </div>
        {line.quantity >= product.maxQuantity && (
          <p className="mt-2 text-micro text-taupe">Limit of {product.maxQuantity} per order for this piece.</p>
        )}
      </div>
    </li>
  );
}
