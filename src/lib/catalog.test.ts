import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { articles } from "@/data/journal";
import { knownSlugs } from "@/data/slugs";
import { applyFilters, filtersToParams, parseFilters, productsInCollection, searchProducts, sortProducts } from "./catalog";

describe("parseFilters", () => {
  it("drops unknown values instead of trusting the URL", () => {
    const f = parseFilters(new URLSearchParams("category=rings,hats&occasion=wedding,x&price=over-500k,cheap&sort=random"));
    expect(f).toEqual({ categories: ["rings"], occasions: ["wedding"], price: ["over-500k"], sort: "featured" });
  });

  it("round-trips through URL params", () => {
    const f = parseFilters(new URLSearchParams("category=rings,necklaces&price=under-200k&sort=price-desc"));
    expect(parseFilters(filtersToParams(f))).toEqual(f);
  });
});

describe("applyFilters", () => {
  const none = { categories: [], occasions: [], price: [], sort: "featured" as const };

  it("returns everything with no filters", () => {
    expect(applyFilters(products, none)).toHaveLength(products.length);
  });

  it("filters by category, occasion and price together", () => {
    const r = applyFilters(products, { ...none, categories: ["rings"], occasions: ["wedding"], price: ["over-500k"] });
    expect(r.map((p) => p.slug)).toEqual(["vow-bridal-pair"]);
  });

  it("treats multiple values in one group as OR", () => {
    const r = applyFilters(products, { ...none, categories: ["earrings", "bracelets"] });
    expect(new Set(r.map((p) => p.category))).toEqual(new Set(["earrings", "bracelets"]));
  });

  it("price bands are inclusive and non-overlapping", () => {
    const counts = ["under-200k", "200k-500k", "over-500k"].map(
      (band) => applyFilters(products, { ...none, price: [band as never] }).length,
    );
    expect(counts.reduce((a, b) => a + b, 0)).toBe(products.length);
  });
});

describe("sortProducts", () => {
  it("sorts by price both ways", () => {
    const asc = sortProducts(products, "price-asc").map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(sortProducts(products, "price-desc")[0].price).toBe(Math.max(...products.map((p) => p.price)));
  });

  it("puts the most recently added first for newest", () => {
    expect(sortProducts(products, "newest")[0].slug).toBe("verdant-emerald-pendant");
  });

  it("does not mutate the source array", () => {
    const before = products.map((p) => p.id);
    sortProducts(products, "price-asc");
    expect(products.map((p) => p.id)).toEqual(before);
  });
});

describe("searchProducts", () => {
  it("matches names, materials and categories, case-insensitively", () => {
    expect(searchProducts("PEARL").map((p) => p.slug)).toContain("luna-pearl-drops");
    expect(searchProducts("emerald").map((p) => p.slug)).toEqual(["verdant-emerald-pendant"]);
    expect(searchProducts("ring").every((p) => p.category === "rings")).toBe(true);
    expect(searchProducts("ring").length).toBe(3);
    expect(searchProducts("earrings").map((p) => p.slug)).toEqual(["luna-pearl-drops"]);
    expect(searchProducts("pearls").map((p) => p.slug)).toContain("luna-pearl-drops");
  });

  it("requires every word to match", () => {
    expect(searchProducts("pearl bracelet")).toHaveLength(0);
  });

  it("returns nothing for empty queries", () => {
    expect(searchProducts("   ")).toEqual([]);
  });
});

describe("catalogue integrity", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("gives every product at least one image with alt text and a positive integer price", () => {
    for (const p of products) {
      expect(p.images.length).toBeGreaterThan(0);
      p.images.forEach((img) => expect(img.alt.length).toBeGreaterThan(10));
      expect(Number.isInteger(p.price) && p.price > 0).toBe(true);
    }
  });

  it("has no empty collections", () => {
    for (const c of collections) expect(productsInCollection(c).length).toBeGreaterThan(0);
  });

  it("keeps the Proxy slug registry in sync with the data", () => {
    expect([...knownSlugs.products].sort()).toEqual(products.map((p) => p.slug).sort());
    expect([...knownSlugs.collections].sort()).toEqual(collections.map((c) => c.slug).sort());
    expect([...knownSlugs.journal].sort()).toEqual(articles.map((a) => a.slug).sort());
  });
});
