"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { searchProducts, sortOptions, sortProducts, type SortValue } from "@/lib/catalog";
import { collections } from "@/data/collections";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLink } from "@/components/ui/primitives";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = (params.get("q") ?? "").slice(0, 100);
  const sortParam = params.get("sort");
  const sort = (sortOptions.some((o) => o.value === sortParam) ? sortParam : "featured") as SortValue;
  const [draft, setDraft] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  // Keep the input in step with back/forward navigation.
  if (q !== lastQ) {
    setLastQ(q);
    setDraft(q);
  }

  const results = sortProducts(searchProducts(q), sort);

  function navigate(next: { q?: string; sort?: SortValue }) {
    const sp = new URLSearchParams();
    const nq = next.q ?? q;
    const ns = next.sort ?? sort;
    if (nq) sp.set("q", nq);
    if (ns !== "featured") sp.set("sort", ns);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ q: draft.trim() });
        }}
        className="flex max-w-2xl items-center gap-4 border-b border-obsidian pb-3"
      >
        <Search size={22} strokeWidth={1} aria-hidden="true" className="shrink-0 text-taupe" />
        <label htmlFor="search-page-input" className="sr-only">
          Search jewellery
        </label>
        <input
          id="search-page-input"
          type="search"
          enterKeyHint="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Rings, pearls, emerald…"
          className="font-display min-w-0 flex-1 bg-transparent text-[1.75rem] leading-tight outline-none placeholder:text-taupe/60"
        />
        <button type="submit" className="pressable shrink-0 text-[0.875rem] font-medium tracking-[0.04em]">
          Search
        </button>
      </form>

      {q ? (
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-caption text-taupe" aria-live="polite">
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </p>
            {results.length > 1 && (
              <label className="flex items-center gap-3 text-caption text-taupe">
                Sort by
                <select
                  value={sort}
                  onChange={(e) => navigate({ sort: e.target.value as SortValue })}
                  className="min-h-11 cursor-pointer bg-transparent text-[0.9375rem] text-obsidian outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {results.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {results.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 max-w-lg">
              <p className="display-sm">Nothing matches “{q}”.</p>
              <p className="mt-3 text-taupe">Try a stone, a metal or a type of piece, such as “pearl”, “gold” or “ring”.</p>
              <ArrowLink href="/shop" className="mt-8">
                Browse all jewellery
              </ArrowLink>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12">
          <p className="text-caption text-taupe">Or browse a collection</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {collections.map((c) => (
              <li key={c.slug}>
                <ArrowLink href={`/collections/${c.slug}`}>{c.name}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
