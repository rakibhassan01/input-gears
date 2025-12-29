"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Save,
  ArrowLeft,
  ImageIcon,
  Loader2,
  RefreshCw,
  Info,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/products/components/product-card";
import { createProduct } from "@/modules/admin/actions"; // ⚠️ পাথ চেক করুন
import { cn } from "@/lib/utils";

// --- Validation Schema ---
const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description needs more detail"),
  price: z.coerce.number().min(0.1, "Price required"),
  stock: z.coerce.number().min(0, "Stock required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // React Hook Form Setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 10,
      image: "",
    },
    mode: "onChange",
  });

  // Watch values for Live Preview
  const watchedValues = form.watch();

  // --- Auto Generate Slug ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);

    // Simple slugify logic
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    form.setValue("slug", slug, { shouldValidate: true });
  };

  // --- Submit Handler ---
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const res = await createProduct(data);

      if (res.success) {
        toast.success(res.message);
        router.push("/admin/products");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20">
      {/* 1. Top Action Bar */}
      <div className="flex items-center justify-between mb-8 sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500">
              Create a new product for your store
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* --- LEFT SIDE: FORM --- */}
        <div className="lg:col-span-2 space-y-8">
          <form className="space-y-8">
            {/* A. General Information */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                General Information
              </h2>
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    {...form.register("name")}
                    onChange={handleNameChange} // Custom handler for slug auto-gen
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    placeholder="e.g. Premium Leather Jacket"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Slug <Info size={14} className="text-gray-400" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      /products/
                    </span>
                    <input
                      {...form.register("slug")}
                      className="w-full pl-24 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-mono text-sm text-indigo-600"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                      title="Regenerate"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  {form.formState.errors.slug && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...form.register("description")}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                    placeholder="Describe your product..."
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* B. Media (Image) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </p>
                    <input
                      {...form.register("image")}
                      className="w-full max-w-md text-center text-sm border-b border-gray-300 focus:border-indigo-500 outline-none bg-transparent py-2"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-400 mt-4">
                      Enter a direct link to your image (Unsplash, Cloudinary,
                      etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* C. Pricing & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Pricing
                </h2>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...form.register("price")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Inventory
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    {...form.register("stock")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE: PREVIEW (Sticky) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-1">Live Preview</h3>
              <p className="text-gray-400 text-xs">
                See how your product looks in the store.
              </p>
            </div>

            {/* The Actual Product Card Preview */}
            <div className="pointer-events-none opacity-100 ring-4 ring-gray-100 rounded-3xl overflow-hidden bg-white">
              <ProductCard
                data={{
                  id: "preview-id",
                  name: watchedValues.name || "Product Name",
                  price: Number(watchedValues.price) || 0,
                  image: watchedValues.image || null,
                  description: watchedValues.description,
                  stock: Number(watchedValues.stock),
                  slug: watchedValues.slug || "preview-slug",
                }}
              />
            </div>

            {/* Quick Summary */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900">Uncategorized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
