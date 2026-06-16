"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GrillCartItem {
  id: string; // uniquely identifies this combination
  productId: string;
  name: string;
  price: number;
  quantity: number;
  doneness?: string;
  side1?: string;
  side2?: string;
  imageUrl?: string | null;
}

interface GrillCartStore {
  items: GrillCartItem[];
  isOpen: boolean;
  addItem: (item: Omit<GrillCartItem, "quantity" | "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
}

export const useGrillCartStore = create<GrillCartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) =>
        set((state) => {
          const generatedId = `${newItem.productId}-${newItem.doneness || ""}-${newItem.side1 || ""}-${newItem.side2 || ""}`;
          const existingItem = state.items.find((item) => item.id === generatedId);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === generatedId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...newItem, id: generatedId, quantity: 1 }],
            isOpen: true,
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: (open) =>
        set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),
    }),
    {
      name: "grill-cart-storage",
    }
  )
);
