"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  // categoryId: z.string().optional(), // যদি ক্যাটাগরি থাকে
});

export type ProductFormValues = z.infer<typeof productSchema>;

export async function createProduct(data: ProductFormValues) {
  try {
    const validatedData = productSchema.parse(data);

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return {
        success: false,
        message: "Slug already exists. Try a different name.",
      };
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        image: validatedData.image || null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product created successfully!",
      productId: product.id,
    };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, message: "Failed to create product" };
  }
}
// ... আগের কোডের নিচে যোগ করুন

export async function updateProduct(id: string, data: ProductFormValues) {
  try {
    // Validation
    const validatedData = productSchema.parse(data);

    // Slug unique check (নিজের slug বাদে অন্য কারো সাথে মিলছে কিনা)
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug: validatedData.slug,
        NOT: { id: id }, // নিজের ID বাদ দিয়ে চেক করবে
      },
    });

    if (existingProduct) {
      return {
        success: false,
        message: "Slug already exists. Try a different name.",
      };
    }

    // Update Query
    await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        image: validatedData.image || null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    return { success: true, message: "Product updated successfully!" };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, message: "Failed to update product" };
  }
}
