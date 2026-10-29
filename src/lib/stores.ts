"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { getProductById } from "./catalog";
import { addLine, removeLine, sanitiseLines, setLineQuantity, type CartLine, type CartResult } from "./cart";

/*
 * Guest bag and wishlist, persisted to localStorage. There is no account system, so state lives
 * on this device only. `skipHydration` keeps server and first client render identical; the
 * StoreHydrator component rehydrates after mount.
 */

interface CartState {
  lines: CartLine[];
  add: (productId: string, variantId: string | null, quantity?: number) => CartResult;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (productId, variantId, quantity = 1) => {
        const result = addLine(get().lines, getProductById, productId, variantId, quantity);
        if (result.ok) set({ lines: result.lines });
        return result;
      },
      setQuantity: (key, quantity) => set({ lines: setLineQuantity(get().lines, getProductById, key, quantity) }),
      remove: (key) => set({ lines: removeLine(get().lines, key) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "ratna-bag",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines }),
      merge: (persisted, current) => ({
        ...current,
        lines: sanitiseLines((persisted as { lines?: unknown } | undefined)?.lines, getProductById),
      }),
    },
  ),
);

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const saved = get().ids.includes(productId);
        set({ ids: saved ? get().ids.filter((id) => id !== productId) : [...get().ids, productId] });
        return !saved;
      },
      remove: (productId) => set({ ids: get().ids.filter((id) => id !== productId) }),
    }),
    {
      name: "ratna-wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const ids = (persisted as { ids?: unknown } | undefined)?.ids;
        return {
          ...current,
          ids: Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && !!getProductById(id)) : [],
        };
      },
    },
  ),
);

/* Transient UI state shared between the header, drawers and product pages */
interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));

/* Hydration status, so pages can avoid flashing an "empty bag" before storage is read */
const hydrationListeners = new Set<() => void>();
let storesHydrated = false;

export function markStoresHydrated() {
  storesHydrated = true;
  hydrationListeners.forEach((l) => l());
}

export function useStoresHydrated() {
  return useSyncExternalStore(
    (cb) => {
      hydrationListeners.add(cb);
      return () => hydrationListeners.delete(cb);
    },
    () => storesHydrated,
    () => false,
  );
}
