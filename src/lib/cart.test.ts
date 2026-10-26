import { describe, expect, it } from "vitest";
import { addLine, cartCount, cartSubtotal, lineKey, removeLine, sanitiseLines, setLineQuantity, type CartLine } from "./cart";
import { getProductById } from "./catalog";

const ring = getProductById("p-aurelle")!; // has sizes, max 2, 4,85,000
const pendant = getProductById("p-pear")!; // no variants, max 3, 2,75,000
const set = getProductById("p-sera")!; // size 9 unavailable

describe("addLine", () => {
  it("requires a size for pieces with variants", () => {
    const r = addLine([], getProductById, ring.id, null);
    expect(r.ok).toBe(false);
    expect(r.lines).toHaveLength(0);
  });

  it("rejects unavailable variants", () => {
    const r = addLine([], getProductById, set.id, "size-9");
    expect(r.ok).toBe(false);
  });

  it("rejects unknown products", () => {
    expect(addLine([], getProductById, "nope", null).ok).toBe(false);
  });

  it("adds, then merges the same piece and size into one line", () => {
    let lines: CartLine[] = [];
    lines = addLine(lines, getProductById, ring.id, "size-7").lines;
    lines = addLine(lines, getProductById, ring.id, "size-7").lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(2);
  });

  it("keeps different sizes as separate lines", () => {
    let lines: CartLine[] = [];
    lines = addLine(lines, getProductById, ring.id, "size-6").lines;
    lines = addLine(lines, getProductById, ring.id, "size-8").lines;
    expect(lines.map((l) => l.key)).toEqual([lineKey(ring.id, "size-6"), lineKey(ring.id, "size-8")]);
  });

  it("enforces the per-piece maximum", () => {
    let lines = addLine([], getProductById, ring.id, "size-7", 5).lines;
    expect(lines[0].quantity).toBe(ring.maxQuantity);
    const again = addLine(lines, getProductById, ring.id, "size-7");
    expect(again.ok).toBe(false);
    lines = again.lines;
    expect(lines[0].quantity).toBe(ring.maxQuantity);
  });

  it("ignores a variant id for pieces without variants", () => {
    const r = addLine([], getProductById, pendant.id, "size-7");
    expect(r.ok).toBe(true);
    expect(r.lines[0].variantId).toBeNull();
  });
});

describe("quantities and totals", () => {
  const base = addLine(addLine([], getProductById, pendant.id, null, 2).lines, getProductById, ring.id, "size-5").lines;

  it("calculates count and subtotal with integer arithmetic", () => {
    expect(cartCount(base)).toBe(3);
    expect(cartSubtotal(base, getProductById)).toBe(pendant.price * 2 + ring.price);
    expect(cartSubtotal(base, getProductById)).toBe(1_035_000);
  });

  it("clamps quantity updates and removes lines set below one", () => {
    const key = lineKey(pendant.id, null);
    expect(setLineQuantity(base, getProductById, key, 99).find((l) => l.key === key)!.quantity).toBe(pendant.maxQuantity);
    expect(setLineQuantity(base, getProductById, key, 0).some((l) => l.key === key)).toBe(false);
    expect(setLineQuantity(base, getProductById, key, 1.7).find((l) => l.key === key)!.quantity).toBe(1);
  });

  it("removes a line", () => {
    expect(removeLine(base, lineKey(ring.id, "size-5"))).toHaveLength(1);
  });
});

describe("sanitiseLines (restoring a stored bag)", () => {
  it("drops garbage, unknown products, invalid variants and duplicates; clamps quantities", () => {
    const stored = [
      null,
      "x",
      { productId: "gone", variantId: null, quantity: 1 },
      { productId: ring.id, variantId: "size-42", quantity: 1 },
      { productId: set.id, variantId: "size-9", quantity: 1 },
      { productId: pendant.id, variantId: null, quantity: 50 },
      { productId: pendant.id, variantId: null, quantity: 1 },
      { productId: ring.id, variantId: "size-6", quantity: "2" },
    ];
    const clean = sanitiseLines(stored, getProductById);
    expect(clean).toEqual([
      { key: lineKey(pendant.id, null), productId: pendant.id, variantId: null, quantity: pendant.maxQuantity },
      { key: lineKey(ring.id, "size-6"), productId: ring.id, variantId: "size-6", quantity: 2 },
    ]);
  });

  it("returns an empty bag for non-array input", () => {
    expect(sanitiseLines({ lines: [] }, getProductById)).toEqual([]);
  });
});
