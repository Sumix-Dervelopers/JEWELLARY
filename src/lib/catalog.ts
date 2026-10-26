import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { CategorySlug, Collection, OccasionSlug, Product } from "./types";

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function productsInCollection(collection: Collection, source: Product[] = products) {
  const { category, collection: edit } = collection.match;
  return source.filter((p) => (category ? p.category === category : true) && (edit ? p.collections.includes(edit) : true));
}

export function featuredProducts() {
  return products.filter((p) => p.featured);
}

export function relatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const sharedEdit = products.filter(
    (p) => p.id !== product.id && p.category !== product.category && p.collections.some((c) => product.collections.includes(c)),
  );
  const rest = products.filter((p) => p.id !== product.id && !sameCategory.includes(p) && !sharedEdit.includes(p));
  return [...sameCategory, ...sharedEdit, ...rest].slice(0, limit);
}

/* ---------- Filtering and sorting (shared by shop, collection and search pages) ---------- */

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export const priceBands = [
  { value: "under-200k", label: "Under Rs 2,00,000", min: 0, max: 199_999 },
  { value: "200k-500k", label: "Rs 2,00,000 to 5,00,000", min: 200_000, max: 500_000 },
  { value: "over-500k", label: "Over Rs 5,00,000", min: 500_001, max: Number.POSITIVE_INFINITY },
] as const;

export type PriceBand = (typeof priceBands)[number]["value"];

export interface Filters {
  categories: CategorySlug[];
  occasions: OccasionSlug[];
  price: PriceBand[];
  sort: SortValue;
}

const categorySet = new Set<string>(["rings", "necklaces", "earrings", "bracelets"]);
const occasionSet = new Set<string>(["gifts-for-her", "milestones", "wedding", "everyday"]);
const priceSet = new Set<string>(priceBands.map((b) => b.value));
const sortSet = new Set<string>(sortOptions.map((s) => s.value));

/** Parses URL search params defensively: unknown values are dropped rather than trusted. */
export function parseFilters(params: URLSearchParams): Filters {
  const list = (key: string, allowed: Set<string>) =>
    (params.get(key) ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter((v) => allowed.has(v));
  const sort = params.get("sort") ?? "featured";
  return {
    categories: list("category", categorySet) as CategorySlug[],
    occasions: list("occasion", occasionSet) as OccasionSlug[],
    price: list("price", priceSet) as PriceBand[],
    sort: (sortSet.has(sort) ? sort : "featured") as SortValue,
  };
}

export function filtersToParams(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.occasions.length) params.set("occasion", filters.occasions.join(","));
  if (filters.price.length) params.set("price", filters.price.join(","));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
}

export function applyFilters(source: Product[], filters: Filters) {
  const bands = priceBands.filter((b) => filters.price.includes(b.value));
  const result = source.filter(
    (p) =>
      (!filters.categories.length || filters.categories.includes(p.category)) &&
      (!filters.occasions.length || p.occasions.some((o) => filters.occasions.includes(o))) &&
      (!bands.length || bands.some((b) => p.price >= b.min && p.price <= b.max)),
  );
  return sortProducts(result, filters.sort);
}

export function sortProducts(source: Product[], sort: SortValue) {
  const list = [...source];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => b.addedOn.localeCompare(a.addedOn));
    default:
      // Featured first, then catalogue order (stable sort keeps the curated order).
      return list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
}

/* ---------- Search ---------- */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Every query word must begin a word in the product's searchable text, so "ring" finds rings
 * but not earrings, and "pearl" also finds "pearls".
 */
export function searchProducts(query: string, source: Product[] = products) {
  const terms = normalise(query).split(/[^a-z0-9]+/).filter(Boolean);
  if (!terms.length) return [];
  return source.filter((p) => {
    const words = normalise(
      [p.name, p.category, p.summary, p.materials.metal, p.materials.stones ?? "", ...p.collections].join(" "),
    ).split(/[^a-z0-9]+/);
    return terms.every((t) => {
      const stem = t.length > 3 ? t.replace(/s$/, "") : t;
      return words.some((w) => w.startsWith(stem));
    });
  });
}
