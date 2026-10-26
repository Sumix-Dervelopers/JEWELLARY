"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import { cartCount, cartSubtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart, useUi } from "@/lib/stores";
import { buttonClass, ArrowLink } from "@/components/ui/primitives";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const lines = useCart((s) => s.lines);
  const pathname = usePathname();
  const count = cartCount(lines);
  const subtotal = cartSubtotal(lines, getProductById);
  const close = () => setOpen(false);

  // Close if the route changes underneath the drawer (e.g. browser back).
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="right">
      <Drawer.Portal>
        <Drawer.Backdrop className="overlay-backdrop z-50" />
        <Drawer.Viewport className="fixed inset-0 z-50">
          <Drawer.Popup className="drawer-panel drawer-panel--right bg-ivory text-obsidian shadow-[-24px_0_48px_-32px_rgb(16_16_15/0.4)]">
            <div className="flex h-[calc(var(--header-h)+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-line px-6 pt-[env(safe-area-inset-top)] md:px-8">
              <Drawer.Title className="font-display text-2xl">
                Your bag{count > 0 && <span className="ml-2 font-sans text-base text-taupe tabular-nums">({count})</span>}
              </Drawer.Title>
              <Drawer.Close aria-label="Close bag" className="pressable -mr-2.5 grid size-11 place-items-center">
                <X size={20} strokeWidth={1.15} />
              </Drawer.Close>
            </div>

            {lines.length === 0 ? (
              <Drawer.Content className="flex flex-1 flex-col items-start justify-center px-6 md:px-8">
                <p className="font-display text-3xl leading-tight">Your bag is empty.</p>
                <Drawer.Description className="mt-3 max-w-[32ch] text-taupe">
                  Pieces you add will wait here while you keep looking.
                </Drawer.Description>
                <ArrowLink href="/shop" onClick={close} className="mt-8">
                  Explore the collection
                </ArrowLink>
              </Drawer.Content>
            ) : (
              <>
                <Drawer.Content className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-8">
                  <Drawer.Description className="sr-only">Review the pieces in your bag.</Drawer.Description>
                  <ul className="divide-y divide-line">
                    {lines.map((line) => (
                      <CartLineItem key={line.key} line={line} onNavigate={close} />
                    ))}
                  </ul>
                </Drawer.Content>
                <div className="shrink-0 border-t border-line px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-8">
                  <div className="flex items-baseline justify-between">
                    <span>Subtotal</span>
                    <span className="font-display text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-caption text-taupe">Delivery and any taxes are confirmed with your order enquiry.</p>
                  <div className="mt-6 grid gap-3">
                    <Link href="/checkout" onClick={close} className={buttonClass("dark", "w-full")}>
                      Continue to checkout
                    </Link>
                    <Link href="/cart" onClick={close} className={buttonClass("outline-dark", "w-full")}>
                      View bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
