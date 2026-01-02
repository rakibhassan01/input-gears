"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle, CalendarClock, Ban } from "lucide-react";

interface StatusBadgeProps {
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

type BadgeStatus = "live" | "scheduled" | "expired" | "inactive";

// ✅ FIX: Helper function moved OUTSIDE the component
// This prevents "accessed before initialization" errors
const formatDuration = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
};

export default function StatusBadge({
  isActive,
  startDate,
  endDate,
}: StatusBadgeProps) {
  const [status, setStatus] = useState<BadgeStatus>("inactive");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      // 1. Inactive Check
      if (!isActive) {
        setStatus("inactive");
        setMessage("Disabled");
        return;
      }

      const now = new Date();
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // 2. Scheduled (Future)
      if (start && now < start) {
        setStatus("scheduled");
        const diff = start.getTime() - now.getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        // ২৪ ঘন্টার কম বাকি থাকলে কাউন্টডাউন, বেশি হলে ডেট দেখাবে
        if (diff < oneDay) {
          setMessage(`Starts in ${formatDuration(diff)}`);
        } else {
          setMessage(
            `Starts ${start.toLocaleDateString()} at ${start.toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}`
          );
        }
        return;
      }

      // 3. Expired (Past)
      if (end && now > end) {
        setStatus("expired");
        setMessage(`Ended on ${end.toLocaleDateString()}`);
        return;
      }

      // 4. Live (Running)
      setStatus("live");
      if (end) {
        const diff = end.getTime() - now.getTime();
        setMessage(`Ends in ${formatDuration(diff)}`);
      } else {
        setMessage("Running indefinitely");
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [isActive, startDate, endDate]);

  // --- UI RENDER ---

  if (status === "inactive") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] sm:text-[11px] font-semibold tracking-wide whitespace-nowrap">
        <Ban size={12} />
        INACTIVE
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] sm:text-[11px] font-semibold tracking-wide whitespace-nowrap">
        <AlertCircle size={12} />
        EXPIRED
      </div>
    );
  }

  if (status === "scheduled") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] sm:text-[11px] font-semibold tracking-wide shadow-sm whitespace-nowrap">
        <CalendarClock size={12} />
        {message}
      </div>
    );
  }

  // Live Status
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-[11px] font-semibold tracking-wide shadow-sm whitespace-nowrap">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="uppercase">LIVE</span>
      <span className="w-px h-3 bg-emerald-200 mx-0.5"></span>
      <span className="font-mono font-medium opacity-90">{message}</span>
    </div>
  );
}
