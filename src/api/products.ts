import api from "@/api";
import type { Product, ProductsResponse, CreateProductData, UpdateProductData } from "@/types/product";

const PRODUCTS_API_BASE = "/products";

export const productsApi = {
  // Get all products with pagination
  getProducts: async (params: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {}): Promise<ProductsResponse> => {
    const { limit = 10, skip = 0, sortBy, order } = params;
    let url = `${PRODUCTS_API_BASE}?limit=${limit}&skip=${skip}`;
    
    if (sortBy && order) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await api.get<ProductsResponse>(url);
    console.log("response",response)
    return response.data;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`${PRODUCTS_API_BASE}/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<Product>(`${PRODUCTS_API_BASE}/add`, data);
    return response.data;
  },

  // Update product
  updateProduct: async (data: UpdateProductData): Promise<Product> => {
    const { id, ...updateData } = data;
    const response = await api.put<Product>(`${PRODUCTS_API_BASE}/${id}`, updateData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ isDeleted: boolean; id: number }> => {
    const response = await api.delete<{ isDeleted: boolean; id: number }>(`${PRODUCTS_API_BASE}/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`${PRODUCTS_API_BASE}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
