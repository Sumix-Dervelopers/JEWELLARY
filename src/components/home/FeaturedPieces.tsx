"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { products } from "@/data/products";
import { categoryNames } from "@/data/collections";
import type { CategorySlug } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLink, cn } from "@/components/ui/primitives";

const filters: { value: "featured" | CategorySlug; label: string }[] = [
  { value: "featured", label: "Selected" },
  { value: "rings", label: categoryNames.rings },
  { value: "necklaces", label: categoryNames.necklaces },
  { value: "earrings", label: categoryNames.earrings },
  { value: "bracelets", label: categoryNames.bracelets },
];

export function FeaturedPieces() {
  const [active, setActive] = useState<(typeof filters)[number]["value"]>("featured");
  const reduce = usePrefersReducedMotion();
  const shown = (active === "featured" ? products.filter((p) => p.featured) : products.filter((p) => p.category === active)).slice(0, 4);

  return (
    <section aria-labelledby="featured-title" className="border-t border-line bg-parchment/60">
      <div className="wrap py-24 md:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="featured-title" className="display-lg">
              Pieces to begin with
            </h2>
            <p className="mt-4 max-w-[44ch] text-taupe">
              Four designs we would choose first, one from each part of the collection.
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div role="group" aria-label="Show pieces by category" className="-mx-[var(--gutter)] flex gap-x-1 overflow-x-auto px-[calc(var(--gutter)-0.75rem)] [scrollbar-width:none] sm:mx-0 sm:px-0">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={active === f.value}
                  onClick={() => setActive(f.value)}
                  className={cn(
                    "pressable relative min-h-10 shrink-0 px-3 text-[0.875rem] tracking-[0.02em] whitespace-nowrap transition-colors duration-200",
                    active === f.value ? "text-obsidian" : "text-taupe hover:text-obsidian",
                  )}
                >
                  {f.label}
                  {active === f.value && (
                    <motion.span
                      layoutId="featured-underline"
                      className="absolute inset-x-3 bottom-1.5 h-px bg-obsidian"
                      transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.ul layout={!reduce} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-16 lg:grid-cols-4 lg:gap-x-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <motion.li
                key={p.id}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-16 flex justify-center">
          <ArrowLink href={active === "featured" ? "/shop" : `/collections/${active}`}>
            {active === "featured" ? "View all jewellery" : `View all ${categoryNames[active].toLowerCase()}`}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}

