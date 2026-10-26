"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDown } from "lucide-react";
import { primaryNav } from "@/config/navigation";
import { collections, occasions } from "@/data/collections";
import { HairlineArrow } from "@/components/ui/primitives";

function MenuLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <NavigationMenu.Link closeOnClick render={<NextLink href={href} />} className={className}>
      {children}
    </NavigationMenu.Link>
  );
}

const categories = collections.filter((c) => c.kind === "category");
const edits = collections.filter((c) => c.kind === "edit");

/** Desktop primary navigation with the Collections mega menu (Base UI handles hover intent, focus and Escape). */
export function DesktopNav({
  anchor,
  onOpenChange,
}: {
  anchor: RefObject<HTMLElement | null>;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root onValueChange={(value) => onOpenChange(value != null)} delay={80} closeDelay={160}>
      <NavigationMenu.List className="flex items-center gap-6 2xl:gap-8">
        {primaryNav.map((item) =>
          "mega" in item ? (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Trigger className="group/trigger flex h-11 items-center gap-1.5 text-[0.8125rem] tracking-[0.01em] outline-none focus-visible:outline-1">
                <span className="link-line">{item.label}</span>
                <NavigationMenu.Icon className="transition-transform duration-200 ease-[var(--ease-out)] data-popup-open:rotate-180">
                  <ChevronDown size={12} strokeWidth={1.25} />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="w-full">
                <div className="wrap grid grid-cols-12 gap-10 py-12">
                  <div className="col-span-3">
                    <p className="label text-taupe">Categories</p>
                    <ul className="mt-6 space-y-3">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <MenuLink href={`/collections/${c.slug}`} className="display-sm link-line">
                            {c.name}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-3">
                    <p className="label text-taupe">Occasions</p>
                    <ul className="mt-6 space-y-3 text-[0.9375rem]">
                      {occasions.map((o) => (
                        <li key={o.slug}>
                          <MenuLink href={`/shop?occasion=${o.slug}`} className="link-line">
                            {o.name}
                          </MenuLink>
                        </li>
                      ))}
                      <li className="pt-3">
                        <MenuLink href="/shop" className="group inline-flex items-center gap-3 text-taupe hover:text-obsidian">
                          All jewellery <HairlineArrow />
                        </MenuLink>
                      </li>
                    </ul>
                  </div>
                  {edits.map((c) => (
                    <MenuLink key={c.slug} href={`/collections/${c.slug}`} className="group col-span-3 block">
                      <span className="zoom-frame relative block aspect-[4/3] bg-parchment">
                        <Image
                          src={c.image.src}
                          alt=""
                          fill
                          sizes="22vw"
                          className="object-cover"
                          placeholder="blur"
                        />
                      </span>
                      <span className="mt-4 flex items-baseline justify-between gap-4">
                        <span className="display-sm">{c.name}</span>
                        <HairlineArrow />
                      </span>
                      <span className="mt-1 block text-caption text-taupe">{c.tagline}</span>
                    </MenuLink>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Link
                render={<NextLink href={item.href} />}
                active={pathname === item.href}
                className="link-line flex h-11 items-center text-[0.8125rem] tracking-[0.01em]"
              >
                {item.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          anchor={anchor}
          side="bottom"
          align="start"
          sideOffset={0}
          collisionAvoidance={{ side: "none", align: "none" }}
          collisionPadding={0}
          className="z-40 w-[var(--anchor-width)]"
        >
          <NavigationMenu.Popup className="mega-popup w-[var(--anchor-width)] border-b border-line bg-ivory text-obsidian shadow-[0_24px_48px_-32px_rgb(16_16_15/0.35)] outline-none">
            <NavigationMenu.Viewport className="relative w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
