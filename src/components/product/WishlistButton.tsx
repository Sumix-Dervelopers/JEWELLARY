"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/lib/stores";
import { cn } from "@/components/ui/primitives";

export function WishlistButton({
  productId,
  productName,
  variant = "icon",
  className,
}: {
  productId: string;
  productName: string;
  variant?: "icon" | "text";
  className?: string;
}) {
  const saved = useWishlist((s) => s.ids.includes(productId));
  const toggle = useWishlist((s) => s.toggle);
  const [announcement, setAnnouncement] = useState("");

  function onClick() {
    const nowSaved = toggle(productId);
    setAnnouncement(nowSaved ? `${productName} saved to your wishlist` : `${productName} removed from your wishlist`);
  }

  const heart = (
    <Heart
      size={variant === "icon" ? 18 : 17}
      strokeWidth={1.15}
      aria-hidden="true"
      className={cn(
        "transition-[fill,color,transform] duration-300 ease-[var(--ease-out)]",
        saved ? "scale-100 fill-current text-antique" : "fill-transparent",
      )}
    />
  );

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
          className={cn(
            "grid size-11 place-items-center text-obsidian transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.85]",
            className,
          )}
        >
          {heart}
        </button>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={saved}
          className={cn(
            "pressable inline-flex min-h-12 items-center justify-center gap-3 border border-obsidian/30 px-6 text-[0.875rem] font-medium tracking-[0.04em] transition-colors duration-200 hover:border-obsidian",
            className,
          )}
        >
          {heart}
          {saved ? "Saved to wishlist" : "Save to wishlist"}
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
