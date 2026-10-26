import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/collections";
import { HairlineArrow, cn } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

const order = ["rings", "necklaces", "earrings", "bracelets", "bridal"];

export function CollectionShowcase() {
  const tiles = order.map((slug) => collections.find((c) => c.slug === slug)!);

  return (
    <section id="collections" aria-labelledby="collections-title" className="wrap py-24 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <h2 id="collections-title" className="display-lg max-w-[14ch]">
            Find the piece that is yours
          </h2>
        </Reveal>
        <Reveal stagger={1} className="max-w-[38ch] text-taupe md:pb-2">
          <p>Rings, necklaces, earrings and bracelets, with a bridal edit for the day itself and every day after.</p>
        </Reveal>
      </div>

      {/* 4 × 2 grid: the lead tile spans a 2 × 2 block, so every tile keeps a 4:5 frame */}
      <ul className="mt-14 grid grid-cols-2 gap-3 md:mt-20 lg:aspect-[16/10] lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
        {tiles.map((c, i) => {
          const lead = i === 0;
          return (
            <li key={c.slug} className={cn(lead && "col-span-2 lg:row-span-2")}>
              <Link
                href={`/collections/${c.slug}`}
                className="group on-dark relative block h-full overflow-hidden bg-parchment text-ivory"
              >
                <div className={cn("zoom-frame relative h-full", lead ? "aspect-[4/5] lg:aspect-auto" : "aspect-[4/5] lg:aspect-auto")}>
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    placeholder="blur"
                    sizes={lead ? "(min-width: 1024px) 46vw, 100vw" : "(min-width: 1024px) 23vw, 50vw"}
                    className="object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
                  <div>
                    <h3 className={cn(lead ? "display-md" : "display-sm")}>{c.name}</h3>
                    <p
                      className={cn(
                        "mt-1 max-w-[28ch] text-caption text-ivory/80",
                        "transition-[opacity,transform] duration-300 ease-[var(--ease-out)]",
                        "[@media(hover:hover)_and_(pointer:fine)]:translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:opacity-0",
                        "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                        !lead && "hidden sm:block",
                      )}
                    >
                      {c.tagline}
                    </p>
                  </div>
                  <HairlineArrow className="mb-2 hidden shrink-0 sm:inline-flex" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
