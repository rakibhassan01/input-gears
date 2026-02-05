import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(2, "Name is too short"),

  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),

  street: z.string().min(5, "Street address is too short"),
  city: z.string().min(2, "City is required"),

  state: z.union([z.string(), z.null(), z.undefined(), z.literal("")]),

  zip: z.string().min(3, "Invalid ZIP code"),

  type: z.enum(["HOME", "WORK"]).default("HOME"),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
