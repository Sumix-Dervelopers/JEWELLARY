"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useLayoutEffect, useMemo, useOptimistic, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Drawer } from "@base-ui/react/drawer";
import { SlidersHorizontal, X } from "lucide-react";
import { products as allProducts } from "@/data/products";
import { categoryNames, occasions } from "@/data/collections";
import {
  applyFilters,
  filtersToParams,
  parseFilters,
  priceBands,
  sortOptions,
  type Filters,
  type SortValue,
} from "@/lib/catalog";
import type { CategorySlug, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, cn } from "@/components/ui/primitives";

type Scope = { category?: CategorySlug; collection?: string };

function inScope(p: Product, { category, collection }: Scope) {
  return (!category || p.category === category) && (!collection || p.collections.includes(collection));
}

const categoryList = Object.entries(categoryNames) as [CategorySlug, string][];

export function ShopBrowser({ category, collection }: Scope) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = usePrefersReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the filter drawer when this page is hidden by a navigation (Activity keeps it mounted).
  useLayoutEffect(() => () => setDrawerOpen(false), []);

  const urlFilters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  // Controls respond immediately; the URL (the source of truth) catches up inside the transition.
  const [filters, setOptimisticFilters] = useOptimistic(urlFilters);
  const scoped = useMemo(() => allProducts.filter((p) => inScope(p, { category, collection })), [category, collection]);
  const results = useMemo(() => applyFilters(scoped, filters), [scoped, filters]);

  // Only offer options that exist within this page's scope.
  const categories = categoryList.filter(([slug]) => scoped.some((p) => p.category === slug));
  const occasionList = occasions.filter((o) => scoped.some((p) => p.occasions.includes(o.slug)));
  const showCategory = !category && categories.length > 1;

  function update(next: Filters) {
    const qs = filtersToParams(next).toString();
    startTransition(() => {
      setOptimisticFilters(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function toggle<K extends "categories" | "occasions" | "price">(key: K, value: Filters[K][number]) {
    const list = filters[key] as string[];
    const nextList = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    update({ ...filters, [key]: nextList });
  }

  const active = [
    ...filters.categories.map((v) => ({ key: "categories" as const, value: v, label: categoryNames[v] })),
    ...filters.occasions.map((v) => ({ key: "occasions" as const, value: v, label: occasions.find((o) => o.slug === v)!.name })),
    ...filters.price.map((v) => ({ key: "price" as const, value: v, label: priceBands.find((b) => b.value === v)!.label })),
  ];
  const clearAll = () => update({ categories: [], occasions: [], price: [], sort: filters.sort });

  const fields = (
    <div className="space-y-10">
      {showCategory && (
        <FilterGroup legend="Category">
          {categories.map(([slug, name]) => (
            <Check
              key={slug}
              label={name}
              count={scoped.filter((p) => p.category === slug).length}
              checked={filters.categories.includes(slug)}
              onChange={() => toggle("categories", slug)}
            />
          ))}
        </FilterGroup>
      )}
      {occasionList.length > 0 && (
        <FilterGroup legend="Occasion">
          {occasionList.map((o) => (
            <Check
              key={o.slug}
              label={o.name}
              count={scoped.filter((p) => p.occasions.includes(o.slug)).length}
              checked={filters.occasions.includes(o.slug)}
              onChange={() => toggle("occasions", o.slug)}
            />
          ))}
        </FilterGroup>
      )}
      <FilterGroup legend="Price">
        {priceBands.map((b) => (
          <Check
            key={b.value}
            label={b.label}
            count={scoped.filter((p) => p.price >= b.min && p.price <= b.max).length}
            checked={filters.price.includes(b.value)}
            onChange={() => toggle("price", b.value)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  const countLabel = `${results.length} ${results.length === 1 ? "piece" : "pieces"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
      {/* Desktop filters */}
      <aside aria-label="Filters" className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">{fields}</div>
      </aside>

      <div className="lg:col-span-9">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="pressable -ml-1 inline-flex min-h-11 items-center gap-2.5 px-1 text-[0.875rem] font-medium lg:hidden"
            >
              <SlidersHorizontal size={16} strokeWidth={1.25} aria-hidden="true" />
              Filter{active.length > 0 && <span className="tabular-nums">({active.length})</span>}
            </button>
            <p className="text-caption text-taupe" aria-live="polite">
              {countLabel}
            </p>
          </div>
          <label className="flex items-center gap-3 text-caption text-taupe">
            Sort by
            <select
              value={filters.sort}
              onChange={(e) => update({ ...filters, sort: e.target.value as SortValue })}
              className="min-h-11 cursor-pointer border-0 bg-transparent py-1 pr-1 text-[0.9375rem] text-obsidian outline-none focus-visible:outline-1"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Active filters */}
        {active.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {active.map((a) => (
              <button
                key={`${a.key}-${a.value}`}
                type="button"
                onClick={() => toggle(a.key, a.value as never)}
                className="pressable inline-flex min-h-9 items-center gap-2 border border-line-strong px-3 text-caption transition-colors hover:border-obsidian"
              >
                {a.label}
                <X size={12} strokeWidth={1.5} aria-hidden="true" />
                <span className="sr-only">, remove filter</span>
              </button>
            ))}
            <button type="button" onClick={clearAll} className="link-line ml-2 text-caption text-taupe hover:text-obsidian">
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <motion.ul layout={!reduce} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:gap-x-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout={!reduce}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                >
                  <ProductCard product={p} preload={i < 2} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="mt-16 max-w-md">
            <p className="font-display text-3xl leading-tight">No pieces match these filters.</p>
            <p className="mt-3 text-taupe">Remove a filter or clear them all to see the full selection.</p>
            <Button tone="outline-dark" className="mt-8" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection="right">
        <Drawer.Portal>
          <Drawer.Backdrop className="overlay-backdrop z-50" />
          <Drawer.Viewport className="fixed inset-0 z-50">
            <Drawer.Popup className="drawer-panel drawer-panel--right bg-ivory">
              <div className="flex h-[calc(var(--header-h)+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-line px-6 pt-[env(safe-area-inset-top)]">
                <Drawer.Title className="font-display text-2xl">Filter</Drawer.Title>
                <Drawer.Close aria-label="Close filters" className="pressable -mr-2.5 grid size-11 place-items-center">
                  <X size={20} strokeWidth={1.15} />
                </Drawer.Close>
              </div>
              <Drawer.Content className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">{fields}</Drawer.Content>
              <div className="flex shrink-0 gap-3 border-t border-line px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Button tone="outline-dark" className="flex-1 px-4" onClick={clearAll} disabled={!active.length}>
                  Clear
                </Button>
                <Button className="flex-[2] px-4" onClick={() => setDrawerOpen(false)}>
                  Show {countLabel}
                </Button>
              </div>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-lg">{legend}</legend>
      <div className="mt-4 space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 text-[0.9375rem]", count === 0 && !checked && "opacity-45")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={count === 0 && !checked}
        className="size-4 shrink-0 cursor-pointer accent-obsidian"
      />
      <span className="flex-1">{label}</span>
      <span className="text-caption text-taupe tabular-nums">{count}</span>
    </label>
  );
}
