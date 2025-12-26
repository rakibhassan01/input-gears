"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  TouchEvent, // TouchEvent টাইপ ইমপোর্ট
} from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Type Definitions ---

interface SlideData {
  id: number;
  imageSrc: string;
  altText: string;
  link?: string; // Optional Link Property added
}

// --- Configuration ---
const AUTO_SLIDE_INTERVAL = 5000;
const MIN_SWIPE_DISTANCE = 50; // Swipe sensitivity

// Mock Data (Real world scenario te eta props hisebe ashbe)
const SLIDES: SlideData[] = [
  {
    id: 1,
    imageSrc:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
    altText: "Global Network",
    link: "/network", // Example Link
  },
  {
    id: 2,
    imageSrc:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
    altText: "Chip Circuitry",
    // No link here
  },
  {
    id: 3,
    imageSrc:
      "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=2670&auto=format&fit=crop",
    altText: "Tech Lab",
    link: "/tech-lab",
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Touch Swipe States ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // --- Navigation Logic (useCallback fixed) ---

  const goToSlide = useCallback((index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex === SLIDES.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex === 0 ? SLIDES.length - 1 : currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // --- Auto Play Effect ---
  useEffect(() => {
    if (SLIDES.length <= 1) return; // Logic fix: Don't autoplay if 1 slide

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, nextSlide]);

  // --- Touch Event Handlers (Swipe Logic) ---

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Guard Clause
  if (!SLIDES.length) return null;

  return (
    // 🎨 UI Update based on Logic Source:
    // Container width restricted to 1440px and padding added
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 mt-4 md:mt-6">
      <div
        className="relative w-full aspect-[16/8] md:aspect-[21/8] lg:aspect-[24/8] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm bg-gray-100 select-none group isolate border border-gray-100"
        // Touch Handlers attached here
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Loop */}
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;

          // Inner Content (Image)
          const SlideContent = (
            <>
              <NextImage
                src={slide.imageSrc}
                alt={slide.altText}
                fill
                priority={index === 0}
                className="object-cover object-center"
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1440px"
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
            </>
          );

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* 🔗 Link Logic Implementation */}
              {slide.link ? (
                <Link
                  href={slide.link}
                  className="block w-full h-full relative cursor-pointer"
                >
                  {SlideContent}
                </Link>
              ) : (
                <div className="w-full h-full relative">{SlideContent}</div>
              )}
            </div>
          );
        })}

        {/* --- Controls (Arrows hidden on mobile touch, visible on desktop hover) --- */}

        {SLIDES.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering link click
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-md border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 hidden md:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-md border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 hidden md:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-300 shadow-sm ${
                    index === currentIndex
                      ? "w-6 md:w-8 bg-white"
                      : "w-1.5 md:w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
