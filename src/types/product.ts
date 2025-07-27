import { z } from "zod";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const productSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(0, { message: "Price must be positive" }),
  discountPercentage: z
    .number()
    .min(0)
    .max(100, { message: "Discount must be between 0-100%" }),
  rating: z.number().min(0).max(5, { message: "Rating must be between 0-5" }),
  stock: z.number().min(0, { message: "Stock must be positive" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }),
});

export type ProductFormData = z.infer<typeof productSchema>;
