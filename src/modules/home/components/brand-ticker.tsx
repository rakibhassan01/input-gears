"use client";

import React from "react";
import {
  Zap,
  Cpu,
  MousePointer2,
  Keyboard,
  Monitor,
  Headphones,
  Gamepad2,
  Laptop,
} from "lucide-react";

const laptop = Laptop;

const brands = [
  { name: "RAZER", icon: Zap },
  { name: "LOGITECH", icon: MousePointer2 },
  { name: "CORSAIR", icon: Cpu },
  { name: "STEELSERIES", icon: Headphones },
  { name: "ASUS ROG", icon: laptop },
  { name: "DUCKY", icon: Keyboard },
  { name: "ZOWIE", icon: Monitor },
  { name: "SENNHEISER", icon: Headphones },
  { name: "HYPERX", icon: Gamepad2 },
];

// Double the brands for seamless looping
const tickerItems = [...brands, ...brands];

export default function BrandTicker() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 mt-6 md:mt-8">
      <div className="w-full bg-white py-6 md:py-8 overflow-hidden rounded-2xl md:rounded-3xl border border-gray-100/60 relative group shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        {/* Background Gradient Ornaments */}
        <div className="absolute top-0 left-0 w-20 md:w-32 h-full bg-linear-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 md:w-32 h-full bg-linear-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap animate-ticker group-hover:paused">
          {tickerItems.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-3 mx-6 md:mx-10 group/item cursor-pointer"
            >
              <div className="text-gray-400 group-hover/item:text-indigo-600 transition-colors duration-300">
                <brand.icon size={18} />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-400 group-hover/item:text-gray-900 transition-colors duration-300 tracking-widest uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        <style jsx global>{`
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-ticker {
            animation: ticker 50s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
