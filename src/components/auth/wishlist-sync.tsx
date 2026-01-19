"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useWishlist } from "@/modules/products/hooks/use-wishlist";

export function WishlistSync() {
  const { data: session, isPending } = useSession();
  const { syncAccount, fetchWishlist, items } = useWishlist();
  const prevSessionRef = useRef(session);

  useEffect(() => {
    if (!isPending) {
      // Logic for when session state changes
      if (session && !prevSessionRef.current) {
        // User just logged in or session restored
        if (items.length > 0) {
          // If we have guest items, sync them with the account
          syncAccount();
        } else {
          // If wishlist is empty, try to fetch existing ones from the database
          fetchWishlist();
        }
      }
      prevSessionRef.current = session;
    }
  }, [session, isPending, items.length, syncAccount, fetchWishlist]);

  return null;
}
