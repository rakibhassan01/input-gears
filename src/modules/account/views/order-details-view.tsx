"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
  ChevronLeft,
  Clock,
  Truck,
  Box,
  BadgeCheck,
  AlertCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import StatusBadge from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  items: OrderItem[];
}

interface OrderDetailsViewProps {
  order: Order;
}

const statusSteps = [
  { label: "Ordered", status: "PENDING", icon: Clock },
  { label: "Processing", status: "PROCESSING", icon: Box },
  { label: "Shipped", status: "SHIPPED", icon: Truck },
  { label: "Delivered", status: "DELIVERED", icon: BadgeCheck },
];

export default function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const currentStep = statusSteps.findIndex(
    (step) => step.status === order.status
  );
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="h-1 w-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5">
              <ShoppingBag size={14} />{" "}
              {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-sm">
            <FileText size={18} />
            Invoice
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 text-gray-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white hover:border-gray-200 transition-all active:scale-95">
            <HelpCircle size={18} />
            Help
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Items & Timeline) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Timeline */}
          {!isCancelled ? (
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">
                Order Tracking
              </h3>
              <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                {/* Connecting Lines for Desktop */}
                <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-0.5 bg-gray-100 z-0" />

                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isActive = index === currentStep;

                  return (
                    <div
                      key={step.label}
                      className="relative z-10 flex md:flex-col items-center gap-4 md:text-center md:flex-1"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                          isCompleted
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-gray-50 text-gray-300"
                        )}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <div
                          className={cn(
                            "text-sm font-black uppercase tracking-widest",
                            isCompleted ? "text-gray-900" : "text-gray-400"
                          )}
                        >
                          {step.label}
                        </div>
                        {isActive && (
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                            In Progress
                          </div>
                        )}
                        {isCompleted && !isActive && (
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm shrink-0">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-red-900 tracking-tight">
                  Order Cancelled
                </h3>
                <p className="text-red-700 font-medium text-sm mt-1">
                  This order has been cancelled and will not be processed
                  further. If this was a mistake, please contact support.
                </p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Order Items
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 md:p-8 flex items-center gap-6 group hover:bg-gray-50/30 transition-colors"
                >
                  <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-black text-gray-900 text-base md:text-lg leading-tight truncate max-w-xs md:max-w-md">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                      <span>QTY: {item.quantity}</span>
                      <span className="h-4 w-px bg-gray-200" />
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-gray-900 text-lg md:text-xl tracking-tight">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Summary & Details) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Order Summary */}
          <div className="bg-gray-900 text-white rounded-[32px] p-8 shadow-2xl shadow-gray-200">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
              Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-white/70 font-bold text-sm">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70 font-bold text-sm">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="font-black uppercase tracking-widest text-xs">
                  Total Amount
                </span>
                <span className="text-3xl font-black tracking-tight">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            {order.paymentStatus === "PAID" && (
              <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-8 w-8 bg-green-500 rounded-xl flex items-center justify-center text-white">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-green-400">
                    Payment Status
                  </div>
                  <div className="text-sm font-black text-green-500">
                    FULLY PAID
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Details */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Shipping
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Receiver
                </div>
                <div className="text-sm font-black text-gray-900">
                  {order.name}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Phone
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {order.phone}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Address
                </div>
                <div className="text-sm font-bold text-gray-700 leading-relaxed italic">
                  &quot;{order.address}&quot;
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <CreditCard size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Payment
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Method
                </div>
                <div className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  {order.paymentMethod}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Status
                </div>
                <div
                  className={cn(
                    "text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block",
                    order.paymentStatus === "PAID"
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  )}
                >
                  {order.paymentStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
