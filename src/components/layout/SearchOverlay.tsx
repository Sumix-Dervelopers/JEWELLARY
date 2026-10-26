"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { collections } from "@/data/collections";
import { useUi } from "@/lib/stores";
import { HairlineArrow, PriceDisplay } from "@/components/ui/primitives";

export function SearchOverlay() {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const results = searchProducts(deferred).slice(0, 5);
  const trimmed = query.trim();

  function close() {
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    close();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={(o) => !o && setQuery("")}>
      <Dialog.Portal>
        <Dialog.Backdrop className="overlay-backdrop z-50" />
        <Dialog.Popup initialFocus={inputRef} className="sheet-top z-50 max-h-[100dvh] overflow-y-auto bg-ivory text-obsidian">
          <div className="wrap pt-[calc(1.25rem+env(safe-area-inset-top))] pb-10">
            <div className="flex items-center justify-between">
              <Dialog.Title className="label text-taupe">Search the collection</Dialog.Title>
              <Dialog.Close aria-label="Close search" className="pressable -mr-2.5 grid size-11 place-items-center">
                <X size={20} strokeWidth={1.15} />
              </Dialog.Close>
            </div>

            <form role="search" onSubmit={submit} className="mt-4 flex items-center gap-4 border-b border-obsidian pb-3">
              <Search size={22} strokeWidth={1} aria-hidden="true" className="shrink-0 text-taupe" />
              <label htmlFor="site-search" className="sr-only">
                Search jewellery
              </label>
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rings, pearls, emerald…"
                className="font-display min-w-0 flex-1 bg-transparent text-[1.75rem] leading-tight outline-none placeholder:text-taupe/60 md:text-[2.25rem]"
              />
              <button type="submit" className="pressable shrink-0 text-[0.875rem] font-medium tracking-[0.04em] disabled:opacity-40" disabled={!trimmed}>
                Search
              </button>
            </form>

            <div className="mt-8" aria-live="polite">
              {trimmed && results.length > 0 && (
                <>
                  <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link href={`/products/${p.slug}`} onClick={close} className="group flex gap-4 py-2 lg:block">
                          <span className="zoom-frame relative block aspect-[4/5] w-20 shrink-0 bg-parchment lg:w-full">
                            <Image src={p.images[0].src} alt="" fill sizes="(min-width: 1024px) 18vw, 80px" className="object-cover" placeholder="blur" />
                          </span>
                          <span className="flex flex-col justify-center lg:mt-3">
                            <span className="font-display text-lg leading-snug">{p.name}</span>
                            <PriceDisplay price={p.price} className="text-caption text-taupe" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/search?q=${encodeURIComponent(trimmed)}`}
                    onClick={close}
                    className="group mt-8 inline-flex items-center gap-4 text-[0.875rem] font-medium"
                  >
                    See every result for “{trimmed}” <HairlineArrow />
                  </Link>
                </>
              )}

              {trimmed && results.length === 0 && (
                <p className="text-taupe">
                  Nothing matches “{trimmed}”. Try a stone, a metal or a type of piece, such as “pearl” or “ring”.
                </p>
              )}

              {!trimmed && (
                <div>
                  <p className="text-caption text-taupe">Browse instead</p>
                  <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                    {collections.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/collections/${c.slug}`} onClick={close} className="link-line font-display text-xl">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
