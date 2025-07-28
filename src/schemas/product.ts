import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  discountPercentage: z.number().min(0).max(100).optional(),
  rating: z.number().min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" }).optional(),
  stock: z.number().int().min(0, { message: "Stock must be a positive number" }),
  brand: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    width: z.number().min(0),
    height: z.number().min(0),
    depth: z.number().min(0),
  }).optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().int().min(1).optional(),
  thumbnail: z.string().url().optional(),
});

export const updateProductSchema = productSchema.partial().extend({
  id: z.number(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
