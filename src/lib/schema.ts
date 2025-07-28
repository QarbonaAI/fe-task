import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  brand: z.string().min(1, "Brand is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
