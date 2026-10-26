import Image from "next/image";
import Link from "next/link";
import { occasions } from "@/data/collections";
import { products } from "@/data/products";
import { images } from "@/data/images";
import { HairlineArrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

/**
 * An occasion index rather than a grid of tiles. Each row leads to the shop filtered by occasion;
 * on pointer devices the row previews the pieces it contains.
 */
export function GiftEdit() {
  return (
    <section aria-labelledby="gift-title" className="on-dark bg-obsidian text-ivory">
      <div className="wrap grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <Reveal variant="mask" className="hidden lg:col-span-4 lg:block">
          <div className="relative aspect-[9/16] max-h-[44rem] bg-ink">
            <Image
              src={images.heroMobile}
              alt="A woman in profile wearing a pear-shaped diamond pendant, ivory silk at her shoulders"
              fill
              sizes="30vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-7 lg:col-start-6">
          <Reveal>
            <h2 id="gift-title" className="display-lg">
              The gift edit
            </h2>
            <p className="mt-5 max-w-[42ch] text-mist">
              Choosing for someone else is easier with a starting point. Begin with the occasion.
            </p>
          </Reveal>

          <ul className="mt-12 border-t border-line-dark">
            {occasions.map((o, i) => {
              const pieces = products.filter((p) => p.occasions.includes(o.slug));
              return (
                <Reveal as="li" key={o.slug} stagger={i} className="border-b border-line-dark">
                  <Link href={`/shop?occasion=${o.slug}`} className="group flex items-center gap-6 py-6 md:py-7">
                    <span className="min-w-0 flex-1">
                      <span className="display-sm block transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-2 motion-reduce:transform-none">
                        {o.name}
                      </span>
                      <span className="mt-1 block text-caption text-mist">{o.line}</span>
                    </span>
                    <span aria-hidden="true" className="hidden items-center gap-2 md:flex">
                      {pieces.slice(0, 3).map((p, j) => (
                        <span
                          key={p.id}
                          className="relative block h-16 w-[3.25rem] overflow-hidden bg-ink opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                          style={{ transitionDelay: `${j * 50}ms` }}
                        >
                          <Image src={p.images[0].src} alt="" fill sizes="52px" className="object-cover" />
                        </span>
                      ))}
                    </span>
                    <span className="shrink-0 text-caption text-mist tabular-nums">
                      {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
                    </span>
                    <HairlineArrow className="shrink-0" />
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
