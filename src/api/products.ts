import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

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

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

export const productsApi = {
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE}/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await axios.post(`${API_BASE}/products/add`, data);
    return response.data;
  },

  updateProduct: async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await axios.put(`${API_BASE}/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    const response = await axios.delete(`${API_BASE}/products/${id}`);
    return response.data;
  },
};