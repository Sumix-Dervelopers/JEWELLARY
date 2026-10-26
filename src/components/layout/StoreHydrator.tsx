"use client";

import { useEffect } from "react";
import { markStoresHydrated, useCart, useWishlist } from "@/lib/stores";

/** Reads the guest bag and wishlist from localStorage once, after the first render. */
export function StoreHydrator() {
  useEffect(() => {
    Promise.all([useCart.persist.rehydrate(), useWishlist.persist.rehydrate()]).finally(markStoresHydrated);
  }, []);
  return null;
}
