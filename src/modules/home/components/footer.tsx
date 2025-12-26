"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Mail,
  MapPin,
  Phone,
  Keyboard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* --- 1. BRAND & ABOUT --- */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-max">
              <div className="bg-white text-black p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Keyboard size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Input<span className="text-indigo-400">Gears</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevate your typing experience. We provide premium mechanical
              keyboards, switches, and desk accessories for enthusiasts and
              pros.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Github size={18} />} />
            </div>
          </div>

          {/* --- 2. QUICK LINKS --- */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <FooterLink href="/products?category=keyboard">
                Mechanical Keyboards
              </FooterLink>
              <FooterLink href="/products?category=mouse">
                Gaming Mice
              </FooterLink>
              <FooterLink href="/products?category=keycaps">
                Artisan Keycaps
              </FooterLink>
              <FooterLink href="/products?category=accessories">
                Desk Mats & Cables
              </FooterLink>
              <FooterLink href="/sale">On Sale 🔥</FooterLink>
            </ul>
          </div>

          {/* --- 3. SUPPORT --- */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <FooterLink href="/track-order">Track Order</FooterLink>
              <FooterLink href="/returns">Returns & Warranty</FooterLink>
              <FooterLink href="/shipping">Shipping Info</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* --- 4. NEWSLETTER (Dynamic) --- */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay in the loop</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>

            {/* TODO: [DYNAMIC] Newsletter Form Handling */}
            <form className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/20 transition"
              />
              <Button
                size="icon"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} InputGears Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components for Cleaner Code
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-white/10 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300"
    >
      {icon}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-indigo-400 hover:pl-1 transition-all duration-200 block"
      >
        {children}
      </Link>
    </li>
  );
}
