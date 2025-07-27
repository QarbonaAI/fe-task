import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  price: z.number().min(0, "Price must be positive").max(10000, "Price must be less than $10,000"),
  discountPercentage: z.number().min(0, "Discount must be positive").max(100, "Discount cannot exceed 100%"),
  rating: z.number().min(0, "Rating must be positive").max(5, "Rating cannot exceed 5"),
  stock: z.number().min(0, "Stock must be positive").max(10000, "Stock must be less than 10,000"),
  brand: z.string().min(1, "Brand is required").max(50, "Brand must be less than 50 characters"),
  category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters"),
  thumbnail: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  images: z.array(z.string().url("Please enter a valid URL")).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>; 