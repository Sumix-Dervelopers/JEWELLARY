"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/components/ui/primitives";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const count = images.length;

  // Activity keeps this page mounted after navigation; don't come back to an open lightbox.
  useLayoutEffect(() => () => setZoomOpen(false), []);

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  function onDragEnd(_: unknown, info: PanInfo) {
    // A quick flick is enough; distance alone is not required.
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  }

  const current = images[index];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[4.5rem_1fr] lg:gap-5">
      {/* Thumbnails */}
      {count > 1 && (
        <ul className="order-2 mt-4 flex gap-3 lg:order-1 lg:mt-0 lg:flex-col" aria-label="Choose an image">
          {images.map((img, i) => (
            <li key={img.src.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  "pressable relative block aspect-[4/5] w-16 overflow-hidden bg-parchment transition-[opacity,box-shadow] duration-200 lg:w-full",
                  i === index ? "opacity-100 ring-1 ring-obsidian ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="72px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Main image */}
      <div className="relative order-1 lg:order-2">
        <div
          className="relative aspect-[4/5] overflow-hidden bg-parchment"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} images`}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.src.src}
              className="absolute inset-0 touch-pan-y"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.23, 1, 0.32, 1] }}
              drag={count > 1 && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                loading={index === 0 ? "eager" : undefined}
                fetchPriority={index === 0 ? "high" : undefined}
                placeholder="blur"
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="pointer-events-none object-cover select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="pressable absolute right-3 bottom-3 z-10 inline-flex min-h-10 items-center gap-2 bg-ivory/85 px-3 text-caption backdrop-blur-[2px] hover:bg-ivory"
          >
            <Expand size={14} strokeWidth={1.25} aria-hidden="true" />
            Enlarge<span className="sr-only"> image {index + 1}</span>
          </button>

          {count > 1 && (
            <p className="absolute bottom-4 left-4 z-10 text-micro tracking-[0.08em] text-ivory/90 tabular-nums mix-blend-difference lg:hidden" aria-hidden="true">
              {index + 1} / {count}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog.Root open={zoomOpen} onOpenChange={setZoomOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="overlay-backdrop z-50" />
          <Dialog.Popup
            className="lightbox on-dark fixed inset-0 z-50 flex flex-col bg-ink text-ivory outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
          >
            <div className="flex shrink-0 items-center justify-between px-[var(--gutter)] pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3">
              <Dialog.Title className="text-caption text-mist">
                {name}
                {count > 1 && (
                  <span className="ml-3 tabular-nums">
                    {index + 1} / {count}
                  </span>
                )}
              </Dialog.Title>
              <Dialog.Close aria-label="Close enlarged image" className="pressable -mr-2.5 grid size-11 place-items-center">
                <X size={22} strokeWidth={1.15} />
              </Dialog.Close>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={90} className="object-contain" />
            </div>
            {count > 1 && (
              <div className="flex shrink-0 justify-center gap-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="pressable grid size-12 place-items-center border border-line-dark hover:border-ivory/60">
                  <ChevronLeft size={20} strokeWidth={1.15} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next image" className="pressable grid size-12 place-items-center border border-line-dark hover:border-ivory/60">
                  <ChevronRight size={20} strokeWidth={1.15} />
                </button>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
