"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative flex flex-col items-center">
          <Ghost className="w-24 h-24 text-primary animate-bounce mb-4" />
          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-primary/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Lost in Space?
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <p className="text-muted-foreground text-lg">
          The page you&apos;re looking for has drifted away or never existed.
          Let&apos;s get you back to familiar gears.
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="rounded-full px-8 group">
            <Link href="/">
              <MoveLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative patterns */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
