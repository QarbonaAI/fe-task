import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.number().min(0.01, { message: 'Price must be greater than 0' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  rating: z.number().min(0, { message: 'Rating must be at least 0' }).max(5, { message: 'Rating must be at most 5' }),
  stock: z.number().min(0, { message: 'Stock must be at least 0' }),
});

export type ProductFormData = z.infer<typeof productSchema>;