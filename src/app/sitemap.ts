import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { articles } from "@/data/journal";

/** Absolute URLs need the real domain: set NEXT_PUBLIC_SITE_URL. Without it the sitemap is empty. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const base = site.url;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.addedOn, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/journal`, changeFrequency: "monthly", priority: 0.5 },
    ...articles.map((a) => ({ url: `${base}/journal/${a.slug}`, lastModified: a.publishedOn, changeFrequency: "yearly" as const, priority: 0.4 })),
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/client-care`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
