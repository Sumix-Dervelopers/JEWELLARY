"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/config/site";

const ROTATE_MS = 6000;

export function AnnouncementBar() {
  const messages = site.announcements;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (messages.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [messages.length, paused]);

  if (!messages.length) return null;

  function dismiss() {
    document.documentElement.dataset.announce = "off";
    try {
      localStorage.setItem("sumix-announce-off", "1");
    } catch {}
  }

  return (
    <div
      className="announcement on-dark relative z-50 bg-ink text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="wrap relative flex h-9 items-center justify-center">
        <p className="relative h-full w-full max-w-[34rem] overflow-hidden text-center text-micro tracking-[0.04em]">
          {messages.map((m, i) => (
            <Link
              key={m.text}
              href={m.href}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              className="absolute inset-0 flex items-center justify-center px-8 text-ivory/85 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] hover:text-ivory motion-reduce:transition-opacity"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? "none" : "translateY(40%)",
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <span className="link-line">{m.text}</span>
            </Link>
          ))}
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcements"
          className="pressable absolute right-[calc(var(--gutter)-0.75rem)] grid size-9 place-items-center text-ivory/60 hover:text-ivory"
        >
          <X size={14} strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
