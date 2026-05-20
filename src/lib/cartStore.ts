"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  toggleCheckout: (open?: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isCheckoutOpen: false,
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true, // Auto open cart when item is added
            };
          }
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true, // Auto open cart when item is added
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
      toggleCheckout: (open) =>
        set((state) => ({
          isCheckoutOpen: open !== undefined ? open : !state.isCheckoutOpen,
        })),
    }),
    {
      name: "carnicero-cart-storage",
    }
  )
);
