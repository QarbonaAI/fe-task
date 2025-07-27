import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().min(1, { message: "Description is required" }).max(500, { message: "Description must be less than 500 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  discountPercentage: z.number().min(0, { message: "Discount percentage must be a positive number" }).max(100, { message: "Discount percentage cannot exceed 100%" }),
  rating: z.number().min(0, { message: "Rating must be a positive number" }).max(5, { message: "Rating cannot exceed 5" }),
  stock: z.number().min(0, { message: "Stock must be a positive number" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  weight: z.number().min(0, { message: "Weight must be a positive number" }),
  dimensions: z.object({
    width: z.number().min(0, { message: "Width must be a positive number" }),
    height: z.number().min(0, { message: "Height must be a positive number" }),
    depth: z.number().min(0, { message: "Depth must be a positive number" }),
  }),
  warrantyInformation: z.string().min(1, { message: "Warranty information is required" }),
  shippingInformation: z.string().min(1, { message: "Shipping information is required" }),
  availabilityStatus: z.string().min(1, { message: "Availability status is required" }),
  returnPolicy: z.string().min(1, { message: "Return policy is required" }),
  minimumOrderQuantity: z.number().min(1, { message: "Minimum order quantity must be at least 1" }),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }),
  images: z.array(z.string().url({ message: "Images must be valid URLs" })).min(1, { message: "At least one image is required" }),
});

export const productUpdateSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>; 