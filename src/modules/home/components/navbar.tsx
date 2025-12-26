// components/Navbar.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export default function Navbar() {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration Error ফিক্স করার জন্য
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-900">
          InputGears ⌨️
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="relative rounded-full">
            <Link href="/cart">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.items.length}
              </span>
            </Link>
          </Button>

          <Button asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
