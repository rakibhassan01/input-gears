// hooks/use-cart.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

// কার্ট আইটেমের টাইপ
export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // স্টক চেক করা
          if (existingItem.quantity + 1 > existingItem.maxStock) {
            toast.error("Out of stock limit reached!");
            return;
          }
          // যদি প্রোডাক্ট থাকে, শুধু কোয়ান্টিটি বাড়বে
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success("Quantity updated in cart");
        } else {
          // নতুন প্রোডাক্ট যোগ করা
          set({ items: [...get().items, { ...data, quantity: 1 }] });
          toast.success("Product added to cart 🛒");
        }
      },
      // ✅ নতুন ফাংশন: সরাসরি কোয়ান্টিটি সেট করার জন্য
      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (item && quantity > item.maxStock) {
          toast.error(`Only ${item.maxStock} items available in stock`);
          return;
        }
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: quantity } : item
          ),
        });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.error("Item removed from cart");
      },

      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared"); // ✅ টোস্ট এড করা হলো
      },
    }),
    {
      name: "shopping-cart-storage", // লোকাল স্টোরেজে এই নামে সেভ হবে
      storage: createJSONStorage(() => localStorage),
    }
  )
);
