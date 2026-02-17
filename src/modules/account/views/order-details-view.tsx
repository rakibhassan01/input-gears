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

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface Order {
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
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Orders
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="h-1 w-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-gray-400" />{" "}
                {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all active:scale-95 shadow-sm">
            <FileText size={16} />
            Invoice
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 hover:text-gray-700 transition-all active:scale-95">
            <HelpCircle size={16} />
            Help
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Items & Timeline) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Timeline */}
          {!isCancelled ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-gray-900 mb-10 uppercase tracking-widest">
                Order Status
              </h3>
              <div className="relative flex flex-col md:flex-row justify-between gap-10 md:gap-4">
                {/* Connecting Lines for Desktop */}
                <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-px bg-gray-100 z-0" />

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
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                          isCompleted
                            ? "bg-gray-900 text-white shadow-md shadow-gray-100"
                            : "bg-gray-50 text-gray-300 border border-gray-100"
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="space-y-1">
                        <div
                          className={cn(
                            "text-[11px] font-bold uppercase tracking-widest",
                            isCompleted ? "text-gray-900" : "text-gray-400"
                          )}
                        >
                          {step.label}
                        </div>
                        {isActive && (
                          <div className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
                            In Progress
                          </div>
                        )}
                        {isCompleted && !isActive && (
                          <div className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
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
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex items-center gap-5">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-red-600 border border-red-100 shadow-sm shrink-0">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest">
                  Order Cancelled
                </h3>
                <p className="text-red-700 font-medium text-xs leading-relaxed">
                  This order has been cancelled and will not be processed further.
                </p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Items In Order
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex items-center gap-5 group hover:bg-gray-50/20 transition-colors"
                >
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2.5 mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>QTY: {item.quantity}</span>
                      <span className="h-1 w-1 bg-gray-200 rounded-full" />
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Summary & Details) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 pb-2 border-b border-gray-50">
              Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-xs text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            {order.paymentStatus === "PAID" && (
              <div className="mt-6 bg-green-50/50 border border-green-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="h-7 w-7 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <BadgeCheck size={16} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-green-600">
                    Payment Status
                  </div>
                  <div className="text-xs font-bold text-green-700 uppercase">
                    Paid
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 border-b border-gray-50 pb-3">
              <MapPin size={16} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Shipping
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Receiver
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {order.name}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Phone
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {order.phone}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Address
                </div>
                <div className="text-sm font-medium text-gray-600 leading-relaxed">
                  {order.address}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 border-b border-gray-50 pb-3">
              <CreditCard size={16} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Payment
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Method
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                  {order.paymentMethod}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Status
                </div>
                <div
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md inline-block",
                    order.paymentStatus === "PAID"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-yellow-50 text-yellow-600 border border-yellow-100"
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
