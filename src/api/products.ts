// Product API utility for CRUD operations
import { z } from "zod";

// Product type (based on DummyJSON API)
export type Product = {
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
};

// Zod schemas for product creation and update
export const productCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().min(0),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  images: z.array(z.string().url()),
});

export const productUpdateSchema = productCreateSchema.partial();

// API base URL
const API_URL = "https://dummyjson.com/products";

// Fetch products with pagination
export async function getProducts({ limit = 10, skip = 0 }: { limit?: number; skip?: number }) {
  const res = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<{ products: Product[]; total: number; skip: number; limit: number }>;
}

// Fetch single product by ID
export async function getProductById(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json() as Promise<Product>;
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">) {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json() as Promise<Product>;
}

// Update a product
export async function updateProduct(id: number, product: Partial<Omit<Product, "id">>) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json() as Promise<Product>;
}

// Delete a product
export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json() as Promise<{ id: number }>;
} 