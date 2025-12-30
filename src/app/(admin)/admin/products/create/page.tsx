"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
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
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/modules/products/components/product-card";
import { createProduct, getCategoriesOptions } from "@/modules/admin/actions";
import { generateSlug } from "@/lib/utils";
import ImageUpload from "@/components/ui/image-upload";
import CategoryModal from "@/modules/admin/components/category-modal";

// --- Validation Schema ---
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description needs more detail"),
  price: z.coerce.number().min(0.1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 10,
      image: "",
      categoryId: "",
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  // Fetch Categories
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

  // Slug Logic
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name, { shouldValidate: true });
    const slug = generateSlug(name);
    form.setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
  };

  // Submit Handler
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const res = await createProduct(data);
      if (res.success) {
        toast.success("Product added successfully! Ready for next one.");

        form.reset({
          name: "",
          slug: "",
          description: "",
          price: 0,
          stock: 10,
          image: "",
          categoryId: data.categoryId,
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        if (res.message.toLowerCase().includes("slug")) {
          form.setError("slug", { type: "manual", message: res.message });
          toast.error(res.message);
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log("Validation Errors:", errors);
    if (errors.categoryId) {
      toast.error("Don't forget to select a category!");
    } else {
      toast.error("Please check the form for errors.");
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
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-500">
                Create a new product for your store inventory.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Change 2: Removed 'items-start' to fix Sticky height issue */}
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
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register("name")}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. Wireless Noise Cancelling Headphones"
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
                      Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                          /products/
                        </span>
                        <input
                          {...form.register("slug")}
                          className={`w-full pl-24 pr-10 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none font-mono text-sm text-indigo-600 transition-all ${
                            form.formState.errors.slug
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-indigo-500"
                          }`}
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
                              toast.info("Slug regenerated from name");
                            }
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Regenerate from Name"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>

                      {/* ✅ Change 3: External Link Icon */}
                      {watchedValues.slug && (
                        <Link
                          href={`/products/${watchedValues.slug}`}
                          target="_blank"
                          className="p-3 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-indigo-600 transition-colors"
                          title="Preview URL in new tab"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      )}
                    </div>

                    {form.formState.errors.slug && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} />
                        <span>{form.formState.errors.slug.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Category Selection */}
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
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white outline-none appearance-none transition-all cursor-pointer ${
                            form.formState.errors.categoryId
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-indigo-500"
                          }`}
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
                        title="Refresh Categories"
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
                      placeholder="Detailed description of the product..."
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
                <div className="space-y-4">
                  <ImageUpload
                    value={watchedValues.image ? [watchedValues.image] : []}
                    disabled={isPending}
                    onChange={(url) =>
                      form.setValue("image", url, { shouldValidate: true })
                    }
                    onRemove={() =>
                      form.setValue("image", "", { shouldValidate: true })
                    }
                  />
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
                      placeholder="0.00"
                    />
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-xs mt-2">
                      {form.formState.errors.price.message}
                    </p>
                  )}
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
                      placeholder="0"
                    />
                    {form.formState.errors.stock && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* --- RIGHT SIDE: PREVIEW (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold text-lg mb-1">Live Preview</h3>
                <p className="text-indigo-200 text-xs">
                  This is how customers will see your product.
                </p>
              </div>

              <div className="pointer-events-none opacity-100 ring-4 ring-gray-100 rounded-3xl overflow-hidden bg-white shadow-lg">
                <ProductCard
                  data={{
                    id: "preview",
                    name: watchedValues.name || "Product Name",
                    price: Number(watchedValues.price) || 0,
                    image: watchedValues.image || null,
                    description: watchedValues.description,
                    stock: Number(watchedValues.stock),
                    slug: watchedValues.slug || "slug",
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

              <div className="bg-white p-5 rounded-xl border border-gray-200 text-sm space-y-3 shadow-sm">
                <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
                  Quick Summary
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className="font-bold text-xs text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">
                    {categories.find((c) => c.id === watchedValues.categoryId)
                      ?.name || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-sm text-gray-500">
            {form.formState.isDirty
              ? "You have unsaved changes."
              : "Ready to save."}
          </div>
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={form.handleSubmit(onSubmit, onInvalid)}
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}
