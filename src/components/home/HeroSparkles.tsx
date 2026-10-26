"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Star glints placed over the real stones in the hero photograph. The positions are given in
 * the source image's own pixels and mapped through the same object-fit: cover and
 * object-position the <img> uses, so a glint stays on the pendant at every viewport size.
 */

type Frame = {
  width: number;
  height: number;
  /** object-position as fractions, matching the classes on the hero <img> */
  position: [number, number];
  stones: { x: number; y: number; size: number; delay: number; period: number }[];
};

// Keep `position` in step with the object-position classes in HeroSection.
const frames: { desktop: Frame; mobile: Frame } = {
  desktop: {
    width: 1376,
    height: 768,
    position: [0.68, 0.5],
    stones: [
      { x: 1012, y: 640, size: 46, delay: 3.0, period: 4.8 }, // pear pendant
      { x: 925, y: 318, size: 28, delay: 4.6, period: 6.2 }, // drop earring
    ],
  },
  mobile: {
    width: 768,
    height: 1376,
    position: [0.5, 0.18],
    stones: [
      { x: 422, y: 826, size: 38, delay: 3.0, period: 4.8 },
      { x: 343, y: 480, size: 24, delay: 4.6, period: 6.2 },
    ],
  },
};

type Placed = { left: number; top: number; size: number; delay: number; period: number };

export function HeroSparkles() {
  const ref = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mql = window.matchMedia("(min-width: 768px)");

    const place = () => {
      // offsetWidth/Height ignore the entrance and breathe transforms, which also scale the
      // glints because they live inside the same transformed layer as the photograph.
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      if (!cw || !ch) return;
      const f = mql.matches ? frames.desktop : frames.mobile;
      const scale = Math.max(cw / f.width, ch / f.height);
      const ox = (cw - f.width * scale) * f.position[0];
      const oy = (ch - f.height * scale) * f.position[1];
      const unit = Math.min(1.25, Math.max(0.7, scale));
      setPlaced(
        f.stones.map((s) => ({
          left: ox + s.x * scale,
          top: oy + s.y * scale,
          size: Math.round(s.size * unit),
          delay: s.delay,
          period: s.period,
        })),
      );
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    mql.addEventListener("change", place);
    return () => {
      ro.disconnect();
      mql.removeEventListener("change", place);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {placed.map((p, i) => (
        <span
          key={i}
          className="hero-glint hero-ambient"
          style={
            {
              left: p.left,
              top: p.top,
              "--g-size": `${p.size}px`,
              "--g-delay": `${p.delay}s`,
              "--g-period": `${p.period}s`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 40 40" width="100%" height="100%" fill="currentColor">
            {/* four-point star with a fine cross of light */}
            <path d="M20 0 L22.2 17.8 L40 20 L22.2 22.2 L20 40 L17.8 22.2 L0 20 L17.8 17.8 Z" />
            <path d="M20 9 L20.8 19.2 L31 20 L20.8 20.8 L20 31 L19.2 20.8 L9 20 L19.2 19.2 Z" opacity="0.9" transform="rotate(45 20 20)" />
            <circle cx="20" cy="20" r="2.4" />
          </svg>
        </span>
      ))}
    </div>
  );
}
