"use client";

import { MotionConfig } from "motion/react";

/** Motion honours the visitor's reduced-motion setting everywhere: transforms off, fades kept. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
