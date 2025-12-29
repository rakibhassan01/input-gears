"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, ChevronDown } from "lucide-react";
import { updateOrderStatus } from "@/modules/admin/actions";
import { cn } from "@/lib/utils";

// আপনার প্রিজমা স্কিমা অনুযায়ী স্ট্যাটাস লিস্ট
const STATUS_OPTIONS = [
  {
    label: "PENDING",
    value: "PENDING",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    label: "PROCESSING",
    value: "PROCESSING",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    label: "SHIPPED",
    value: "SHIPPED",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    label: "DELIVERED",
    value: "DELIVERED",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    label: "CANCELLED",
    value: "CANCELLED",
    color: "bg-red-100 text-red-700 border-red-200",
  },
];

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  // কালার খুঁজে বের করা
  const activeColor =
    STATUS_OPTIONS.find((s) => s.value === status)?.color ||
    "bg-gray-100 text-gray-700";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // UI তে সাথে সাথে আপডেট দেখাবে (Optimistic Update)

    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error(res.message);
        setStatus(currentStatus); // ফেইল হলে আগের অবস্থায় ফিরে যাবে
      }
    });
  };

  return (
    <div className="relative inline-block w-full max-w-[140px]">
      <div
        className={cn(
          "relative flex items-center px-2.5 py-1.5 rounded-lg border transition-all",
          activeColor,
          isPending && "opacity-70 cursor-wait"
        )}
      >
        {/* Loading Spinner */}
        {isPending ? (
          <Loader2 size={12} className="animate-spin mr-1.5" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50"></span>
        )}

        {/* The Actual Dropdown (Invisible but clickable) */}
        <select
          value={status}
          onChange={handleChange}
          disabled={isPending}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Visible Text */}
        <span className="text-[11px] font-bold uppercase tracking-wider flex-1 truncate">
          {status}
        </span>

        {/* Arrow Icon */}
        <ChevronDown size={12} className="ml-1 opacity-50" />
      </div>
    </div>
  );
}
