"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { HeroParticles } from "./HeroParticles";

const finePointerQuery = "(hover: hover) and (pointer: fine)";

function useFinePointer() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(finePointerQuery);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(finePointerQuery).matches,
    () => false,
  );
}

// Critically damped (no overshoot): decorative drift should feel weighted, never springy.
const drift = { stiffness: 55, damping: 20, mass: 1 };

/**
 * Depth for the hero, layered over the CSS entrance. Three planes move at different rates:
 *   photograph (far)  — scroll: ~¼ speed and a slight push-in; pointer: a few pixels
 *   gold dust  (mid)  — scroll: faster than the photograph; pointer: up to 3× further
 *   copy       (near) — lifts and fades as the hero leaves
 * Transforms are full strings so Motion can keep them on the compositor. Ambient CSS loops
 * and the dust canvas pause whenever the hero is off screen.
 */
export function HeroMotion({ media, children }: { media: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const pointerOn = finePointer && !reduce;
  const [onScreen, setOnScreen] = useState(true);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, drift);
  const sy = useSpring(py, drift);

  const mediaTransform = useTransform(
    [scrollYProgress, sx, sy],
    ([p, x, y]: number[]) => `translate3d(${x}px, ${y}px, 0) translateY(${p * 24}%) scale(${1 + p * 0.06})`,
  );
  const dustTransform = useTransform(scrollYProgress, (p) => `translate3d(0, ${p * -12}%, 0)`);
  const copyTransform = useTransform(scrollYProgress, (p) => `translate3d(0, ${p * -18}%, 0)`);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pause ambient loops (CSS) and the dust canvas while the hero is out of view.
  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest(".hero");
    if (!el || !hero) return;
    const io = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
      if (entry.isIntersecting) hero.removeAttribute("data-paused");
      else hero.setAttribute("data-paused", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!pointerOn) {
      px.set(0);
      py.set(0);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width - 0.5) * -22);
      py.set(((e.clientY - r.top) / r.height - 0.5) * -14);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerOn, px, py]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div className="hero-parallax" style={{ transform: reduce ? "none" : mediaTransform }}>
        {media}
      </motion.div>

      {!reduce && (
        <motion.div className="hero-dust" style={{ transform: dustTransform }}>
          <HeroParticles pointerX={sx} pointerY={sy} active={onScreen} />
        </motion.div>
      )}

      <motion.div
        className="relative z-10 flex h-full"
        style={reduce ? { transform: "none", opacity: 1 } : { transform: copyTransform, opacity: copyOpacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}
