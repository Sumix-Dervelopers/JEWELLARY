import Link from "next/link";
import { getImageProps } from "next/image";
import { images } from "@/data/images";
import { getProduct } from "@/lib/catalog";
import { buttonClass, HairlineArrow, PriceDisplay } from "@/components/ui/primitives";
import { HeroMotion } from "./HeroMotion";
import { HeroSparkles } from "./HeroSparkles";
import "./hero.css";

const alt = "A woman in profile by a window, wearing a pear-shaped diamond pendant and a gold drop earring";

/**
 * The campaign opening. Art direction via <picture>: phones download the vertical frame,
 * larger screens the horizontal one. The entrance and ambient light are CSS (hero.css), so
 * they start on first paint; HeroMotion adds depth and the gold dust once hydrated.
 */
export function HeroSection() {
  const common = { alt, sizes: "100vw", quality: 90 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: images.heroDesktop });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: images.heroMobile, loading: "eager", fetchPriority: "high" });

  // The piece in the photograph, credited like a campaign caption.
  const pictured = getProduct("pear-drop-pendant");

  const media = (
    <div className="hero-media">
      <div className="hero-zoom">
        <div className="hero-breathe hero-ambient">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <source srcSet={mobileSrcSet} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is supplied through imgProps */}
            <img {...imgProps} className="h-full w-full object-cover object-[50%_18%] md:object-[68%_50%]" />
          </picture>
          <div aria-hidden="true" className="hero-keylight hero-ambient" />
          <div aria-hidden="true" className="hero-sheen hero-ambient" />
          <HeroSparkles />
        </div>
      </div>
    </div>
  );

  // Words rise one after another; the index sets each word's delay in hero.css.
  const lines = [["Every", "piece"], ["tells", "a", "story."]];
  let wordIndex = 0;

  return (
    <section
      aria-labelledby="hero-title"
      className="hero on-dark relative isolate -mt-[calc(var(--header-h)+env(safe-area-inset-top)+1px)] min-h-[38rem] overflow-hidden bg-ink text-ivory"
    >
      <HeroMotion media={media}>
        <div className="wrap relative flex w-full flex-col justify-end pb-[max(3.5rem,8svh)] md:justify-center md:pt-[calc(var(--header-h)+1rem)] md:pb-28">
          <div className="max-w-[46rem]">
            <p className="label flex items-center gap-4 text-champagne">
              <span aria-hidden="true" className="hero-rule" />
              <span className="hero-eyebrow-text">The art of adornment</span>
            </p>

            <h1 id="hero-title" className="hero-title mt-6 md:mt-9" aria-label="Every piece tells a story.">
              {lines.map((words, li) => (
                <span key={li} aria-hidden="true" className={li === 1 ? "hero-line hero-line--indent" : "hero-line"}>
                  {words.map((word, wi) => (
                    <span key={word}>
                      <span className="hero-word">
                        <span style={{ "--w": wordIndex++ } as React.CSSProperties}>{word}</span>
                      </span>
                      {wi < words.length - 1 && " "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <div className="hero-indent">
              <p className="hero-copy mt-6 max-w-[30ch] text-[1.0625rem] leading-[1.7] text-ivory/80 md:mt-9 md:text-[clamp(1.0625rem,0.9rem+0.35vw,1.25rem)]">
                Fine jewellery made to be treasured, and chosen to be remembered.
              </p>

              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9 md:mt-11">
                <Link href="/shop" className={buttonClass("light", "hero-cta-primary min-h-[3.25rem] px-8")}>
                  Explore the collection
                </Link>
                <Link
                  href="/about"
                  className="hero-cta-secondary group inline-flex min-h-11 items-center gap-4 text-[0.875rem] font-medium tracking-[0.02em] text-ivory/90 hover:text-ivory"
                >
                  Discover our story
                  <HairlineArrow />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Caption band: a hairline across the foot of the frame, like a campaign credit */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden md:block">
          <div className="wrap">
            <div aria-hidden="true" className="hero-band-rule h-px bg-ivory/20" />
            <div className="hero-band pointer-events-auto flex items-center justify-between py-5">
              {pictured && (
                <Link
                  href={`/products/${pictured.slug}`}
                  className="group flex items-baseline gap-4 text-ivory/80 transition-colors duration-200 hover:text-ivory"
                >
                  <span className="label text-mist">Pictured</span>
                  <span className="font-display text-[1.0625rem] tracking-[-0.005em]">{pictured.name}</span>
                  <PriceDisplay price={pictured.price} className="text-caption text-mist" />
                  <HairlineArrow className="ml-1 self-center" />
                </Link>
              )}
              <a href="#collections" className="flex items-center gap-4 text-ivory/70 transition-colors duration-200 hover:text-ivory">
                <span className="label">Scroll</span>
                <span aria-hidden="true" className="relative block h-px w-14 overflow-hidden bg-ivory/20">
                  <span className="hero-cue hero-ambient absolute inset-0 bg-ivory" />
                </span>
                <span className="sr-only">to the collections</span>
              </a>
            </div>
          </div>
        </div>
      </HeroMotion>

      {/* Scrims keep type readable without flattening the photograph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgb(8_8_8/0.92)_0%,rgb(8_8_8/0.55)_38%,rgb(8_8_8/0.08)_70%)] md:bg-[linear-gradient(90deg,rgb(8_8_8/0.88)_0%,rgb(8_8_8/0.6)_30%,rgb(8_8_8/0.12)_58%,rgb(8_8_8/0)_72%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-ink/60 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-40 bg-gradient-to-t from-ink/55 to-transparent md:block" />
      <div aria-hidden="true" className="hero-grain" />

    </section>
  );
}
