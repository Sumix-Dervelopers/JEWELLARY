"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "./primitives";

/**
 * Reveals its content once as it enters the viewport. Marketing surfaces only — functional UI
 * (grids people filter, forms) should never wait on scroll.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "fade",
  stagger = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: "fade" | "mask";
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={cn(variant === "mask" ? "reveal-mask" : "reveal", className)}
      style={{ "--stagger": stagger } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
