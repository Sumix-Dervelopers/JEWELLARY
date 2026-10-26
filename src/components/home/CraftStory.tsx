import Image from "next/image";
import { images } from "@/data/images";
import { ArrowLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

const principles = [
  { title: "Proportion before ornament", text: "A piece should look right from across a room and feel right on the hand." },
  { title: "Made to be worn", text: "Settings and clasps designed for daily life, not only for the box." },
  { title: "Chosen to last", text: "Designs that will still feel like yours in twenty years." },
];

export function CraftStory() {
  return (
    <section aria-labelledby="craft-title" className="wrap py-24 md:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal variant="mask" className="relative lg:col-span-6">
          <div className="relative aspect-[3/4] bg-parchment">
            <Image
              src={images.craftBench}
              alt="A goldsmith's hands setting a round diamond into a gold ring at a worn wooden bench"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h2 id="craft-title" className="display-lg">
              Made for the moments that matter.
            </h2>
          </Reveal>
          <Reveal stagger={1}>
            <div className="lede mt-8 space-y-5 text-obsidian/85">
              <p>
                Fine jewellery is rarely bought for its own sake. It marks a promise, a beginning, a year that deserves
                remembering.
              </p>
              <p>
                So we design with time in mind: stones held where the light can reach them, lines that stay quiet, and
                pieces made to be worn every day rather than saved for one.
              </p>
            </div>
          </Reveal>
          <Reveal stagger={2}>
            <dl className="mt-12 divide-y divide-line border-y border-line">
              {principles.map((p) => (
                <div key={p.title} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-display text-lg">{p.title}</dt>
                  <dd className="text-[0.9375rem] text-taupe">{p.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal stagger={3}>
            <ArrowLink href="/about" className="mt-10">
              Discover our story
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
