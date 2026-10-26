"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { images } from "@/data/images";
import { ArrowLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The second campaign moment. As the section scrolls into view the framed photograph opens to
 * full bleed (clip-path, so no layout work), and the image drifts a few percent for depth.
 * Reduced motion shows the open frame with no movement.
 */
export function SignatureCampaign() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(9% 7% 9% 7%)", "inset(0% 0% 0% 0%)"]);
  const { scrollYProgress: through } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(through, [0, 1], ["translateY(-4%) scale(1.08)", "translateY(4%) scale(1.08)"]);

  return (
    <section ref={ref} aria-labelledby="signature-title" className="on-dark relative bg-ink text-ivory">
      <div className="relative md:h-[92svh] md:min-h-[36rem]">
        {/* Phones: the photograph stacks above the copy. md+: copy sits in the shadow on the left. */}
        <motion.div className="relative aspect-[4/5] overflow-hidden md:absolute md:inset-0 md:aspect-auto" style={reduce ? undefined : { clipPath: clip }}>
          <motion.div className="absolute inset-0" style={reduce ? undefined : { transform: drift }}>
            <Image
              src={images.campaignEmerald}
              alt="An emerald-cut green pendant framed in diamonds, its gold chain pooled across black silk"
              fill
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[78%_center] md:object-[72%_center]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/0 to-transparent md:bg-gradient-to-r md:from-ink/80 md:via-ink/20 md:to-transparent" />
        </motion.div>

        <div className="wrap relative -mt-16 pb-20 md:mt-0 md:flex md:h-full md:items-center md:pb-0">
          <div className="max-w-[30rem]">
            <Reveal>
              <h2 id="signature-title" className="display-lg">
                Beyond the moment. Into the extraordinary.
              </h2>
            </Reveal>
            <Reveal stagger={1}>
              <p className="lede mt-6 max-w-[38ch] text-ivory/80">
                The Verdant pendant: a step-cut green stone framed in light, on a chain fine enough to disappear. It
                leads our Signature edit, the pieces we consider most our own.
              </p>
            </Reveal>
            <Reveal stagger={2} className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-10">
              <ArrowLink href="/collections/signature">Discover the Signature edit</ArrowLink>
              <ArrowLink href="/products/verdant-emerald-pendant" className="text-ivory/75 hover:text-ivory">
                View the Verdant pendant
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
