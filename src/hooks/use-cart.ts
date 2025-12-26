import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  updateQuantity: (id: string, quantity: number) => void; // New Feature
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
          // যদি অলরেডি থাকে, তাহলে কোয়ান্টিটি ১ বাড়িয়ে দাও (Smart Logic)
          const updatedItems = currentItems.map((item) =>
            item.id === data.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ items: updatedItems });
          return;
        }

        set({ items: [...get().items, data] });
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },

      // ✅ New Function: Quantity কমানো বা বাড়ানোর জন্য
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return; // ১ এর নিচে নামতে পারবে না

        const currentItems = get().items;
        const updatedItems = currentItems.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
