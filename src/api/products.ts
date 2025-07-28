import axios from "axios";
import type { Product, ProductsResponse, ProductFormData, Category } from "@/types/product";

const DUMMY_JSON_BASE_URL = "https://dummyjson.com";

// Get all products with pagination
export const getProducts = async (limit = 30, skip = 0, sortBy?: string, order?: 'asc' | 'desc'): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (skip) params.append('skip', skip.toString());
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);

  const response = await axios.get<ProductsResponse>(`${DUMMY_JSON_BASE_URL}/products?${params.toString()}`);
  return response.data;
};

// Get a single product by ID
export const getProduct = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${DUMMY_JSON_BASE_URL}/products/${id}`);
  return response.data;
};

// Search products
export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(`${DUMMY_JSON_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${DUMMY_JSON_BASE_URL}/products/categories`);
  return response.data;
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(`${DUMMY_JSON_BASE_URL}/products/category/${category}`);
  return response.data;
};

// Add a new product
export const addProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await axios.post<Product>(`${DUMMY_JSON_BASE_URL}/products/add`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Update a product
export const updateProduct = async (id: number, productData: Partial<ProductFormData>): Promise<Product> => {
  const response = await axios.put<Product>(`${DUMMY_JSON_BASE_URL}/products/${id}`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Delete a product
export const deleteProduct = async (id: number): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
  const response = await axios.delete<Product & { isDeleted: boolean; deletedOn: string }>(`${DUMMY_JSON_BASE_URL}/products/${id}`);
  return response.data;
}; 