import axios from 'axios';
import type { Product, ProductsResponse, CreateProductRequest, UpdateProductRequest } from '@/types/product';

const API_BASE = 'https://dummyjson.com';

export const productsApi = {
  // Get all products with pagination
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    return response.data as ProductsResponse;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE}/products/${id}`);
    return response.data as Product;
  },

  // Create product
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await axios.post(`${API_BASE}/products/add`, product);
    return response.data as Product;
  },

  // Update product
  updateProduct: async (product: UpdateProductRequest): Promise<Product> => {
    try {
      const response = await axios.put(`${API_BASE}/products/${product.id}`, {
        title: product.title,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
      });
      return response.data as Product;
    } catch (error) {  
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    const response = await axios.delete(`${API_BASE}/products/${id}`);
    return response.data as { id: number; isDeleted: boolean };
  },
};