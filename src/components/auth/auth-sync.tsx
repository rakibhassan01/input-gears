"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useWishlist } from "@/modules/products/hooks/use-wishlist";
import { useCart } from "@/modules/cart/hooks/use-cart";

export function AuthSync() {
  const { data: session, isPending } = useSession();
  const { syncAccount: syncWishlist, fetchWishlist, items: wishlistItems } = useWishlist();
  const { syncAccount: syncCart, fetchCart, items: cartItems } = useCart();
  const prevSessionRef = useRef(session);

  useEffect(() => {
    if (!isPending) {
      if (session && !prevSessionRef.current) {
        // Wishlist Sync
        if (wishlistItems.length > 0) {
          syncWishlist();
        } else {
          fetchWishlist();
        }

        // Cart Sync
        if (cartItems.length > 0) {
          syncCart();
        } else {
          fetchCart();
        }
      }
      prevSessionRef.current = session;
    }
  }, [session, isPending, wishlistItems.length, cartItems.length, syncWishlist, fetchWishlist, syncCart, fetchCart]);

  return null;
}
