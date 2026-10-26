"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/*
 * Gold dust for the hero: a few dozen motes drifting upward through the light.
 *
 * - Each mote has a depth (z). Nearer motes are larger, brighter, faster and move further
 *   with the pointer, which gives the layer real parallax depth.
 * - Glows are pre-rendered once into small sprites, so each frame is only drawImage calls.
 * - Density follows the key light: more motes on the right, where the model and stones are.
 * - The loop stops entirely when the hero is off screen or the tab is hidden.
 */

type Mote = {
  x: number;
  y: number;
  z: number; // 0.25 (far) to 1 (near)
  r: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  twinkle: number;
  sprite: number;
};

const COLORS = ["255,236,196", "236,207,150", "214,180,118", "255,247,230"];

function makeSprite(rgb: string) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},0.85)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.22)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function HeroParticles({
  pointerX,
  pointerY,
  active,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const startRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    if (active) startRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = COLORS.map(makeSprite);
    let motes: Mote[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Mote => {
      const z = 0.25 + Math.random() ** 1.6 * 0.75;
      return {
        // bias toward the right, where the light falls
        x: (0.15 + Math.random() ** 0.65 * 0.85) * w,
        y: anywhere ? Math.random() * h : h + 20,
        z,
        r: (0.6 + Math.random() * 1.6) * (0.55 + z),
        vy: (6 + Math.random() * 14) * (0.4 + z),
        sway: 6 + Math.random() * 22,
        swaySpeed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.8,
        sprite: Math.floor(Math.random() * sprites.length),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(90, Math.max(26, (w * h) / 16000)));
      if (motes.length > target) motes = motes.slice(0, target);
      while (motes.length < target) motes.push(spawn(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const t = now / 1000;
      const px = pointerX.get();
      const py = pointerY.get();

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.vy * dt;
        if (m.y < -30) motes[i] = spawn(false);
        const sway = Math.sin(t * m.swaySpeed + m.phase) * m.sway;
        // nearer motes travel further with the pointer: up to 3x the photograph's drift
        const x = m.x + sway + px * m.z * 3;
        const y = m.y + py * m.z * 3;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * m.twinkle + m.phase));
        // fade out near the top so motes dissolve rather than vanish
        const edge = Math.min(1, m.y / (h * 0.25));
        ctx.globalAlpha = Math.max(0, tw * edge * (0.25 + m.z * 0.6));
        const s = m.r * 7;
        ctx.drawImage(sprites[m.sprite], x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (activeRef.current && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    };

    const start = () => {
      if (!raf && activeRef.current && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    startRef.current = start;

    resize();
    canvas.dataset.ready = "";
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      startRef.current = null;
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pointerX, pointerY]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
