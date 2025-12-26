// hooks/use-cart.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// টাইপ ডিফিনিশন
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return alert("Item already added to cart.");
        }

        set({ items: [...get().items, data] });
        // এখানে পরে আমরা "Toast" মেসেজ দেখাবো
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // LocalStorage এ এই নামে সেভ থাকবে
      storage: createJSONStorage(() => localStorage),
    }
  )
);
