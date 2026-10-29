import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { ArrowLink, Breadcrumbs } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ratna Jewellers is a fine-jewellery house in Thamel, Kathmandu, making jewellery for the moments people carry with them.",
  alternates: site.url ? { canonical: "/about" } : undefined,
};

/*
 * Portfolio-concept storytelling for a fictional Kathmandu store. Founding dates, techniques and
 * sourcing are intentionally not stated.
 */
export default function AboutPage() {
  return (
    <>
      <section className="wrap pt-10 pb-20 md:pt-14 md:pb-28">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
        <h1 className="display-xl mt-12 max-w-[14ch] md:mt-16">Jewellery that becomes part of your story.</h1>
        <p className="lede mt-8 max-w-[50ch] text-obsidian/80">
          Some objects are bought. Others are kept. From our showroom in Thamel, Kathmandu, we make the second kind: fine
          jewellery chosen to mark a moment, and worn long enough to become part of the person who wears it.
        </p>
      </section>

      <Reveal variant="mask" className="wrap">
        <div className="relative aspect-[4/5] bg-parchment sm:aspect-[16/9]">
          <Image
            src={images.heroDesktop}
            alt="A woman in profile by a window, wearing a pear-shaped diamond pendant"
            fill
            preload
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-[70%_center]"
          />
        </div>
      </Reveal>

      <section className="wrap grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <h2 className="display-md lg:col-span-4">Made to be treasured</h2>
        <div className="lede space-y-6 text-obsidian/85 lg:col-span-6 lg:col-start-6">
          <p>
            A ring given on an ordinary evening. A pendant bought to mark a year that changed everything. Pearls handed
            down, then worn differently by the next person. The pieces that matter most are rarely the loudest ones.
          </p>
          <p>
            That is the jewellery we want to make: considered in proportion, quiet in line, and made for daily life
            rather than a velvet box. A solitaire should sit close enough to the hand to be forgotten. A chain should
            fall where the neckline asks it to.
          </p>
          <p>Chosen to be remembered. Made to be treasured.</p>
        </div>
      </section>

      <section className="on-dark bg-obsidian text-ivory">
        <div className="wrap grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal variant="mask" className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-ink">
              <Image src={images.craftSetting} alt="A round diamond held in six polished gold claws" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="display-md">What guides every design</h2>
            <dl className="mt-10 divide-y divide-line-dark border-y border-line-dark">
              {[
                ["Proportion before ornament", "We would rather remove a detail than add one. The right proportions look effortless for decades."],
                ["Made to be worn", "Settings low enough for daily life, clasps that are easy to fasten, chains that sit where they should."],
                ["Light, not weight", "Stones are held so light can reach them from every side, which is what makes them come alive."],
                ["Chosen with you", "Many pieces begin with a conversation: about a size, a stone or the person it is for."],
              ].map(([t, d]) => (
                <div key={t} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <dt className="font-display text-xl">{t}</dt>
                  <dd className="text-mist">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="wrap py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <h2 className="display-md lg:col-span-5">Begin with a conversation</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="lede text-obsidian/85">
              Whether you know exactly what you want or only who it is for, send us an enquiry. Tell us about the
              occasion, the person and anything you already love, and we will help you find the piece.
            </p>
            <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:gap-10">
              <ArrowLink href="/contact">Send an enquiry</ArrowLink>
              <ArrowLink href="/shop" className="text-taupe hover:text-obsidian">
                Explore the collection
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
