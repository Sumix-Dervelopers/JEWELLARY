import type { Product } from "./types";

export interface CartLine {
  /** productId + variantId, so the same ring in two sizes is two lines */
  key: string;
  productId: string;
  variantId: string | null;
  quantity: number;
}

export type CartResult = { ok: true; lines: CartLine[] } | { ok: false; lines: CartLine[]; reason: string };

export const lineKey = (productId: string, variantId: string | null) => `${productId}::${variantId ?? "default"}`;

type Lookup = (id: string) => Product | undefined;

function clampQuantity(quantity: number, product: Product) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(Math.max(1, Math.floor(quantity)), product.maxQuantity);
}

/** Validates the product, variant and quantity before anything reaches the bag. */
export function addLine(
  lines: CartLine[],
  lookup: Lookup,
  productId: string,
  variantId: string | null,
  quantity = 1,
): CartResult {
  const product = lookup(productId);
  if (!product) return { ok: false, lines, reason: "This piece is no longer available." };
  if (product.availability === "unavailable") return { ok: false, lines, reason: "This piece is currently unavailable." };

  if (product.variants) {
    const option = product.variants.options.find((o) => o.id === variantId);
    if (!option) return { ok: false, lines, reason: `Choose a ${product.variants.name.toLowerCase()} first.` };
    if (!option.available) return { ok: false, lines, reason: `${option.label} is unavailable.` };
  } else {
    variantId = null;
  }

  const key = lineKey(productId, variantId);
  const existing = lines.find((l) => l.key === key);
  const current = existing?.quantity ?? 0;
  if (current >= product.maxQuantity) {
    return { ok: false, lines, reason: `You can add up to ${product.maxQuantity} of this piece.` };
  }
  const next = clampQuantity(current + quantity, product);
  const updated = existing
    ? lines.map((l) => (l.key === key ? { ...l, quantity: next } : l))
    : [...lines, { key, productId, variantId, quantity: next }];
  return { ok: true, lines: updated };
}

export function setLineQuantity(lines: CartLine[], lookup: Lookup, key: string, quantity: number): CartLine[] {
  const line = lines.find((l) => l.key === key);
  if (!line) return lines;
  const product = lookup(line.productId);
  if (!product) return lines.filter((l) => l.key !== key);
  if (quantity < 1) return lines.filter((l) => l.key !== key);
  return lines.map((l) => (l.key === key ? { ...l, quantity: clampQuantity(quantity, product) } : l));
}

export function removeLine(lines: CartLine[], key: string) {
  return lines.filter((l) => l.key !== key);
}

/**
 * Drops lines whose product or variant no longer exists (e.g. a stored bag from an older
 * catalogue) and re-clamps quantities. Runs whenever the bag is read back from storage.
 */
export function sanitiseLines(lines: unknown, lookup: Lookup): CartLine[] {
  if (!Array.isArray(lines)) return [];
  const clean: CartLine[] = [];
  for (const raw of lines) {
    if (!raw || typeof raw !== "object") continue;
    const { productId, variantId, quantity } = raw as Partial<CartLine>;
    if (typeof productId !== "string") continue;
    const product = lookup(productId);
    if (!product || product.availability === "unavailable") continue;
    let variant: string | null = null;
    if (product.variants) {
      const option = product.variants.options.find((o) => o.id === variantId);
      if (!option || !option.available) continue;
      variant = option.id;
    }
    const key = lineKey(productId, variant);
    if (clean.some((l) => l.key === key)) continue;
    clean.push({ key, productId, variantId: variant, quantity: clampQuantity(Number(quantity), product) });
  }
  return clean;
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

/** Integer arithmetic only; prices are whole currency units. */
export function cartSubtotal(lines: CartLine[], lookup: Lookup) {
  return lines.reduce((sum, l) => {
    const product = lookup(l.productId);
    return product ? sum + product.price * l.quantity : sum;
  }, 0);
}
