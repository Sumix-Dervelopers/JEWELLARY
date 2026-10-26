"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { secondaryNav } from "@/config/navigation";
import { cartCount } from "@/lib/cart";
import { useCart, useUi, useWishlist } from "@/lib/stores";
import { cn, Wordmark } from "@/components/ui/primitives";
import { DesktopNav } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

const iconProps = { size: 19, strokeWidth: 1.15 } as const;

/** Visual badge only; the count is part of the control's accessible name. */
function Count({ value }: { value: number }) {
  if (value < 1) return null;
  return (
    <span
      key={value}
      aria-hidden="true"
      className="absolute top-1.5 right-0.5 grid h-4 min-w-4 animate-[count-pop_260ms_var(--ease-out)] place-items-center rounded-full bg-champagne px-1 text-[0.625rem] leading-none font-medium text-ink tabular-nums"
    >
      {value}
    </span>
  );
}

const countLabel = (base: string, n: number, unit: [string, string]) =>
  n > 0 ? `${base}, ${n} ${n === 1 ? unit[0] : unit[1]}` : `${base}, empty`;

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const bagCount = useCart((s) => cartCount(s.lines));
  const wishCount = useWishlist((s) => s.ids.length);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const setSearchOpen = useUi((s) => s.setSearchOpen);
  const setMenuOpen = useUi((s) => s.setMenuOpen);

  // A cheap, passive threshold check: state only changes when the boundary is crossed.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = pathname === "/" && !scrolled && !megaOpen;

  const iconButton =
    "pressable relative grid size-11 place-items-center transition-colors duration-200 hover:text-antique";

  return (
    <>
      <header
        ref={headerRef}
        data-overlay={overlay}
        className={cn(
          "sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,color,border-color] duration-300 ease-[var(--ease-out)]",
          "pt-[env(safe-area-inset-top)] box-content",
          overlay
            ? "on-dark border-b border-transparent bg-transparent text-ivory"
            : "border-b border-line bg-ivory/95 text-obsidian backdrop-blur-sm supports-[backdrop-filter]:bg-ivory/90",
        )}
      >
        <div className="wrap grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left */}
          <div className="flex items-center gap-1 xl:gap-0">
            <button
              type="button"
              className={cn(iconButton, "-ml-2.5 xl:hidden")}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu {...iconProps} />
            </button>
            <button
              type="button"
              className={cn(iconButton, "xl:hidden")}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search {...iconProps} />
            </button>
            <nav aria-label="Primary" className="hidden xl:block">
              <DesktopNav anchor={headerRef} onOpenChange={setMegaOpen} />
            </nav>
          </div>

          {/* Centre */}
          <Link href="/" aria-label="Sumix Jewels, home" className="justify-self-center px-2 py-2">
            <Wordmark />
          </Link>

          {/* Right */}
          <div className="flex items-center justify-end gap-1 xl:gap-2">
            <nav aria-label="House" className="mr-4 hidden items-center gap-6 xl:flex 2xl:gap-8">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="link-line text-[0.8125rem] tracking-[0.01em]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className={cn(iconButton, "hidden xl:grid")}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search {...iconProps} />
            </button>
            <Link
              href="/wishlist"
              className={cn(iconButton, "hidden sm:grid")}
              aria-label={countLabel("Wishlist", wishCount, ["saved piece", "saved pieces"])}
            >
              <Heart {...iconProps} />
              <Count value={wishCount} />
            </Link>
            <button
              type="button"
              className={cn(iconButton, "-mr-2.5")}
              aria-label={countLabel("Shopping bag", bagCount, ["item", "items"])}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag {...iconProps} />
              <Count value={bagCount} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
      <SearchOverlay />
    </>
  );
}
