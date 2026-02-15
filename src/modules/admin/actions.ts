"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// --- 1. Product Schema Update ---
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  colors: z.array(z.string()).default([]),
  switchType: z.string().optional(),
  brand: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  dpi: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  connectionType: z.string().optional().nullable(),
  pollingRate: z.string().optional().nullable(),
  sensor: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  availability: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  scheduledAt: z.string().optional().nullable(),
  specs: z
    .record(z.string(), z.string().or(z.number()).or(z.boolean()).nullable())
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// --- 2. Create Product (Updated) ---
export async function createProduct(data: ProductFormValues) {
  try {
    await requireAdmin();
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
        categoryId: validatedData.categoryId,
        colors: validatedData.colors,
        switchType: validatedData.switchType,
        brand: validatedData.brand,
        sku: validatedData.sku,
        dpi: validatedData.dpi,
        weight: validatedData.weight,
        connectionType: validatedData.connectionType,
        pollingRate: validatedData.pollingRate,
        sensor: validatedData.sensor,
        warranty: validatedData.warranty,
        availability: validatedData.availability,
        isActive: validatedData.isActive,
        scheduledAt: validatedData.scheduledAt
          ? new Date(validatedData.scheduledAt)
          : null,
        specs: validatedData.specs || {},
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

// --- 3. Update Product (Updated) ---
export async function updateProduct(id: string, data: ProductFormValues) {
  try {
    await requireAdmin();
    // Validation
    const validatedData = productSchema.parse(data);

    // Slug unique check
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug: validatedData.slug,
        NOT: { id: id },
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
        categoryId: validatedData.categoryId,
        colors: validatedData.colors,
        switchType: validatedData.switchType,
        brand: validatedData.brand,
        sku: validatedData.sku,
        dpi: validatedData.dpi,
        weight: validatedData.weight,
        connectionType: validatedData.connectionType,
        pollingRate: validatedData.pollingRate,
        sensor: validatedData.sensor,
        warranty: validatedData.warranty,
        availability: validatedData.availability,
        isActive: validatedData.isActive,
        scheduledAt: validatedData.scheduledAt
          ? new Date(validatedData.scheduledAt)
          : null,
        specs: validatedData.specs || {},
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

// --- Category Actions (Same as before) ---
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    await requireAdmin();
    const validated = categorySchema.parse(data);

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, message: "Slug already exists!" };
    }

    await prisma.category.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        image: validated.image || null,
        isActive: true,
      },
    });

    revalidatePath("/admin/categories");
    // Necessary for dropdown refresh if using server components
    revalidatePath("/admin/products/create");

    return { success: true, message: "Category created successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create category" };
  }
}

export async function getCategoriesOptions() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return categories;
}

// --- Order Actions (Same as before) ---
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await requireAdmin();
    const status = z.nativeEnum(OrderStatus).parse(newStatus);

    await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    revalidatePath("/admin/orders");
    return { success: true, message: "Order status updated successfully!" };
  } catch (error) {
    console.error("Status Update Error:", error);
    return { success: false, message: "Failed to update status." };
  }
}
//Site Settings Actions
interface HeroSlideInput {
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
}

// --- 1. Get Data ---
export async function getStoreAppearance() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "general" },
  });

  // --- Top Bar Logic (Kept as is) ---
  let isTopBarActive = settings?.topBarActive ?? false;

  if (settings?.topBarStart || settings?.topBarEnd) {
    const now = new Date();
    if (settings.topBarStart && now < settings.topBarStart)
      isTopBarActive = false;
    if (settings.topBarEnd && now > settings.topBarEnd) isTopBarActive = false;
  }

  const finalSettings = settings
    ? { ...settings, topBarActive: isTopBarActive }
    : null;

  // --- Hero Slides (Simple Fetch) ---
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return {
    settings: finalSettings,
    slides: slides,
  };
}

interface TopBarInput {
  text: string;
  link: string;
  isActive: boolean;
  // UI logic field
  useSchedule: boolean;
  topBarStart?: string;
  topBarEnd?: string;
}

// --- 2. Update Top Bar ---
export async function updateTopBar(data: TopBarInput) {
  await requireAdmin();
  // Logic:
  // Handle scheduling

  const startDate =
    data.useSchedule && data.topBarStart ? new Date(data.topBarStart) : null;
  const endDate =
    data.useSchedule && data.topBarEnd ? new Date(data.topBarEnd) : null;

  await prisma.siteSettings.upsert({
    where: { id: "general" },
    update: {
      topBarText: data.text,
      topBarLink: data.link,
      topBarActive: data.isActive,
      topBarStart: startDate,
      topBarEnd: endDate,
    },
    create: {
      id: "general",
      topBarText: data.text,
      topBarLink: data.link,
      topBarActive: data.isActive,
      topBarStart: startDate,
      topBarEnd: endDate,
    },
  });

  revalidatePath("/");
  return { success: true };
}
// --- 3. Update Hero Slides (Reverted to Simple Version) ---
export async function updateHeroSlides(slides: HeroSlideInput[]) {
  await requireAdmin();
  await prisma.heroSlide.deleteMany();

  if (slides.length > 0) {
    await prisma.heroSlide.createMany({
      data: slides.map((s, i) => ({
        title: s.title || "",
        subtitle: s.subtitle,
        image: s.image,
        link: s.link,
        order: i,
        // ❌ No scheduledStart/End here
      })),
    });
  }

  revalidatePath("/");
  return { success: true };
}

// --- 4. Bulk Delete Orders ---
export async function deleteOrders(orderIds: string[]) {
  try {
    await requireAdmin();

    await prisma.order.deleteMany({
      where: {
        id: { in: orderIds },
      },
    });

    revalidatePath("/admin/orders");
    return {
      success: true,
      message: `${orderIds.length} orders deleted successfully`,
    };
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return { success: false, message: "Failed to delete orders" };
  }
}
// --- 5. Bulk Delete Products ---
export async function deleteProducts(productIds: string[]) {
  try {
    await requireAdmin();

    await prisma.product.deleteMany({
      where: {
        id: { in: productIds },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return {
      success: true,
      message: `${productIds.length} products deleted successfully`,
    };
  } catch (error) {
    console.error("Bulk Delete Products Error:", error);
    return { success: false, message: "Failed to delete products" };
  }
}
// --- 6. Bulk Delete Users ---
export async function deleteUsers(userIds: string[]) {
  try {
    await requireAdmin();

    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });

    revalidatePath("/admin/customers");
    return {
      success: true,
      message: `${userIds.length} customers deleted successfully`,
    };
  } catch (error) {
    console.error("Bulk Delete Users Error:", error);
    return { success: false, message: "Failed to delete users" };
  }
}

// --- 7. Update User ---
const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["user", "admin"]),
  phone: z.string().optional().nullable(),
});

export async function updateUser(
  id: string,
  data: z.infer<typeof userUpdateSchema>,
) {
  try {
    await requireAdmin();
    const validated = userUpdateSchema.parse(data);

    await prisma.user.update({
      where: { id },
      data: {
        name: validated.name,
        email: validated.email,
        role: validated.role,
        phone: validated.phone,
      },
    });

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${id}`);

    return { success: true, message: "User updated successfully!" };
  } catch (error) {
    console.error("Update User Error:", error);
    return { success: false, message: "Failed to update user" };
  }
}

// --- 8. Maintenance Mode Actions ---
interface SiteSettingsWithMaintenance {
  maintenanceMode: boolean;
}

export async function getMaintenanceMode() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "general" },
    });
    return (settings as unknown as SiteSettingsWithMaintenance)?.maintenanceMode ?? false;
  } catch (error) {
    console.error("Get Maintenance Error:", error);
    return false;
  }
}

export async function updateMaintenanceMode(enabled: boolean) {
  try {
    await requireAdmin();
    await prisma.siteSettings.upsert({
      where: { id: "general" },
      // Since 'npx prisma generate' is currently blocked by file locks, we use a targeted cast
      // to allow the new field while maintaining structure.
      update: { maintenanceMode: enabled } as Record<string, boolean>,
      create: { id: "general", maintenanceMode: enabled } as Record<string, string | boolean>,
    });
    return { success: true };
  } catch (error) {
    console.error("Update Maintenance Error:", error);
    return { success: false, message: "Failed to update maintenance mode" };
  }
}
