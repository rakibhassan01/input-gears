import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  stock: number;
  category?: {
    name: string;
  } | null;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i.id === item.id);

        if (!exists) {
          set({ items: [...currentItems, item] });
          toast.success("Added to wishlist ❤️");
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.info("Removed from wishlist");
      },

      toggleItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i.id === item.id);

        if (exists) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
