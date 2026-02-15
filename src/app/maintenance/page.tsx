"use client";

import Link from "next/link";
import { Hammer, Cog, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#081621] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center gap-4 mb-12"
        >
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <Hammer size={32} className="text-blue-400" />
          </div>
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <Cog size={32} className="text-indigo-400 animate-spin-slow" />
          </div>
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <ShieldAlert size={32} className="text-emerald-400" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl font-black tracking-tight mb-6"
        >
          Under <span className="text-blue-500">Maintenance</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-12 max-w-lg mx-auto"
        >
          We&apos;re currently performing scheduled maintenance to improve our gear selection and performance. We&apos;ll be back online shortly!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-zinc-300 text-sm font-medium">
            Status: <span className="text-emerald-400 font-bold">Optimizing Systems</span>
          </div>
          <Link 
            href="/admin" 
            className="text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            Admin Entrance
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
