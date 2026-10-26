"use client";

import Link from "next/link";
import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { collections } from "@/data/collections";
import { useUi, useWishlist } from "@/lib/stores";
import { Wordmark } from "@/components/ui/primitives";

export function MobileMenu() {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const wishCount = useWishlist((s) => s.ids.length);
  const close = () => setOpen(false);

  const edits = collections.filter((c) => c.kind === "edit");
  const mainLinks = primaryNav.filter((i) => !("mega" in i));

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="left">
      <Drawer.Portal>
        <Drawer.Backdrop className="overlay-backdrop z-50" />
        <Drawer.Viewport className="fixed inset-0 z-50">
          <Drawer.Popup className="drawer-panel drawer-panel--left on-dark bg-obsidian text-ivory">
            <div className="flex h-[calc(var(--header-h)+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-line-dark px-[var(--gutter)] pt-[env(safe-area-inset-top)]">
              <Drawer.Title className="m-0">
                <Wordmark />
              </Drawer.Title>
              <Drawer.Close aria-label="Close menu" className="pressable -mr-2.5 grid size-11 place-items-center">
                <X size={20} strokeWidth={1.15} />
              </Drawer.Close>
            </div>
            <Drawer.Content className="flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
              <nav aria-label="Mobile">
                <ul className="space-y-1">
                  {mainLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={close} className="display-md flex min-h-14 items-center">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="label mt-10 text-mist">Collections</p>
                <ul className="mt-4 space-y-1">
                  {edits.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/collections/${c.slug}`} onClick={close} className="flex min-h-11 items-center text-lg">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="mt-10 space-y-1 border-t border-line-dark pt-6 text-ivory/80">
                  {secondaryNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={close} className="flex min-h-11 items-center">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/wishlist" onClick={close} className="flex min-h-11 items-center gap-2">
                      Wishlist
                      {wishCount > 0 && <span className="text-champagne tabular-nums">({wishCount})</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" onClick={close} className="flex min-h-11 items-center">
                      Contact and enquiries
                    </Link>
                  </li>
                </ul>
              </nav>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
