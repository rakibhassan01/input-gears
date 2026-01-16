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
  Loader2,
  RefreshCw,
  Info,
  Layers,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Zap,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"; // Image component import
import ProductCard from "@/modules/products/components/product-card";
import { updateProduct, getCategoriesOptions } from "@/modules/admin/actions";
import { Product } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload"; // ImageUpload component import
import CategoryModal from "@/modules/admin/components/category-modal";
import { generateSlug } from "@/lib/utils";

// ✅ 1. Schema Update: categoryId যোগ করা হয়েছে
const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description needs more detail"),
  price: z.coerce.number().min(0.1, "Price required"),
  stock: z.coerce.number().min(0, "Stock required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  colors: z.array(z.string()).default([]),
  switchType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductEditFormProps {
  product: Product;
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // States for Categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // ✅ 2. Default Values এ categoryId যোগ করা হয়েছে
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
      categoryId: product.categoryId || "",
      colors: (product as any).colors || [],
      switchType: (product as any).switchType || "",
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  // ✅ 3. Fetch Categories
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await getCategoriesOptions();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name, { shouldValidate: true });
    // Edit mode-এ সাধারণত নাম চেঞ্জ করলে স্লাগ অটো চেঞ্জ করা হয় না,
    // তবে আপনি চাইলে ম্যানুয়ালি রিফ্রেশ বাটন দিয়ে করতে পারেন।
  };

  // ✅ 4. Submit Handler
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      // updateProduct ফাংশনে এখন categoryId যাচ্ছে, তাই টাইপ এরর হবে না
      const res = await updateProduct(product.id, data);

      if (res.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            <span className="font-semibold">Product Updated Successfully!</span>
          </div>
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="pt-8 pb-6 px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
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
        </div>

        <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT SIDE: FORM --- */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {/* General Info */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Info size={20} className="text-indigo-600" /> General
                  Information
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
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                          /products/
                        </span>
                        <input
                          {...form.register("slug")}
                          className="w-full pl-24 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-mono text-sm text-indigo-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const currentName = form.getValues("name");
                            if (currentName) {
                              const slug = generateSlug(currentName);
                              form.setValue("slug", slug, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              toast.info("Slug regenerated");
                            }
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Regenerate from Name"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>

                      {watchedValues.slug && (
                        <Link
                          href={`/products/${watchedValues.slug}`}
                          target="_blank"
                          className="p-3 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-indigo-600 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* ✅ 5. Category Selection (নতুন যোগ করা হয়েছে) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Layers
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <select
                          {...form.register("categoryId")}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                        >
                          <option value="">Select a category...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingCategories && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2
                              className="animate-spin text-indigo-600"
                              size={16}
                            />
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <CategoryModal />
                      </div>

                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="p-3 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
                    {form.formState.errors.categoryId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.categoryId.message}
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

              {/* Specifications & Variants */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Zap size={80} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-indigo-600" /> Technical Specifications
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Switch Type */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 block">
                      Keyboard Switch Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Linear", "Tactile", "Clicky", "Optical"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => form.setValue("switchType", type, { shouldDirty: true })}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2",
                            watchedValues.switchType === type
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "bg-white border-gray-100 text-gray-500 hover:border-indigo-200"
                          )}
                        >
                          {watchedValues.switchType === type && <Zap size={14} fill="currentColor" />}
                          {type}
                        </button>
                      ))}
                    </div>
                    <input 
                      {...form.register("switchType")}
                      placeholder="Other switch type..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                    />
                  </div>

                  {/* Colors */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 block">
                      Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(watchedValues as any).colors?.map((color: string, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg group animate-in fade-in zoom-in duration-200"
                        >
                          <div 
                             className="w-3 h-3 rounded-full border border-gray-300"
                             style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">{color}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = [...((watchedValues as any).colors || [])];
                              newColors.splice(index, 1);
                              form.setValue("colors", newColors, { shouldDirty: true });
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {(!(watchedValues as any).colors || (watchedValues as any).colors.length === 0) && (
                        <p className="text-xs text-gray-400 italic">No colors added yet.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        id="color-input-edit"
                        placeholder="Add color (e.g. Red, #FF0000)"
                        className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const value = input.value.trim();
                            if (value) {
                              const currentColors = (watchedValues as any).colors || [];
                              if (!currentColors.includes(value)) {
                                form.setValue("colors", [...currentColors, value], { shouldDirty: true });
                              }
                              input.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("color-input-edit") as HTMLInputElement;
                          const value = input.value.trim();
                          if (value) {
                            const currentColors = (watchedValues as any).colors || [];
                            if (!currentColors.includes(value)) {
                              form.setValue("colors", [...currentColors, value], { shouldDirty: true });
                            }
                            input.value = "";
                          }
                        }}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-indigo-600 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media (Updated to ImageUpload component for consistency) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>
                <div className="space-y-4">
                  {watchedValues.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group h-64 w-full flex items-center justify-center">
                      <div className="relative h-full w-full">
                        <Image
                          src={watchedValues.image}
                          alt="Product Image"
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("image", "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className="bg-white text-red-500 p-2.5 rounded-xl shadow-lg border border-gray-100 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ImageUpload
                      value={[]}
                      disabled={isPending}
                      onChange={(url) =>
                        form.setValue("image", url, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      onRemove={() =>
                        form.setValue("image", "", { shouldValidate: true })
                      }
                    />
                  )}
                  {form.formState.errors.image && (
                    <p className="text-red-500 text-xs mt-2">
                      {form.formState.errors.image.message}
                    </p>
                  )}
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
                  <input
                    type="number"
                    {...form.register("stock")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* --- RIGHT SIDE: PREVIEW --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Preview
                </span>
              </div>

              <div className="pointer-events-none opacity-100 ring-1 ring-gray-200 rounded-3xl overflow-hidden bg-white shadow-xl">
                <ProductCard
                  data={{
                    id: product.id,
                    name: watchedValues.name || "Product Name",
                    price: Number(watchedValues.price) || 0,
                    image: watchedValues.image || null,
                    description: watchedValues.description,
                    stock: Number(watchedValues.stock),
                    slug: watchedValues.slug || "slug",
                    colors: (watchedValues as any).colors,
                    switchType: (watchedValues as any).switchType || undefined,
                    // Matching category name
                    category: {
                      name:
                        categories.find(
                          (c) => c.id === watchedValues.categoryId
                        )?.name || "Uncategorized",
                      slug: "cat",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
            {form.formState.isDirty ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                You have unsaved changes
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                Up to date
              </>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending || !form.formState.isDirty}
              className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}
