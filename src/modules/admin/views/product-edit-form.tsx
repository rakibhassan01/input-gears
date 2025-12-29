"use client";

import { useState } from "react";
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
import { updateProduct } from "@/modules/admin/actions"; // পাথ চেক করুন
import { Product } from "@prisma/client"; // Prisma টাইপ

// Schema (Same as Create)
const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description needs more detail"),
  price: z.coerce.number().min(0.1, "Price required"),
  stock: z.coerce.number().min(0, "Stock required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductEditFormProps {
  product: Product; // ডাটাবেস থেকে আসা প্রোডাক্ট
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // ✅ Default Values সেট করা হলো ডাটাবেসের ডাটা দিয়ে
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  // Auto Slug Generator (Same as Create)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    // আপনি চাইলে এডিট করার সময় অটো স্লাগ বন্ধ রাখতে পারেন
    // যদি চালু রাখতে চান নিচের কোড আনকমেন্ট করুন:
    /*
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    form.setValue("slug", slug, { shouldValidate: true });
    */
  };

  // ✅ Update Handler
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const res = await updateProduct(product.id, data);

      if (res.success) {
        toast.success(res.message);
        router.push("/admin/products");
        router.refresh(); // ডাটা রিফ্রেশ করার জন্য
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500">
              Updating: <span className="font-semibold">{product.name}</span>
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
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* --- LEFT SIDE: FORM --- */}
        <div className="lg:col-span-2 space-y-8">
          <form className="space-y-8">
            {/* General Info */}
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
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
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
                      className="w-full pl-24 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-mono text-sm text-indigo-600"
                    />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none resize-none"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>
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
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold text-lg"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE: PREVIEW --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-1">Live Preview</h3>
              <p className="text-indigo-200 text-xs">Previewing changes.</p>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
