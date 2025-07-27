import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

import { handleAPIError } from "@/lib/errors";
import { env } from "@/env";

// Extend AxiosRequestConfig to include the _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_HOST_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    // config.headers["ngrok-skip-browser-warning"] = "69420";

    return config;
  },
  (error: AxiosError) => Promise.reject(handleAPIError(error)),
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const error = err as AxiosError;
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   try {
    //     const refresh_token = localStorage.getItem("refreshToken");
    //     if (!refresh_token) {
    //       throw new Error("No refresh token found");
    //     }

    //     const { data } = await api.post<APIResponse>("/admin/refresh", {
    //       token: refresh_token,
    //       device_id: "", // todo
    //     });
    //     const payload = data.data as loginData;
    //     const token = payload.token;

    //     localStorage.setItem("token", token);

    //     originalRequest.headers.Authorization = `Bearer ${token}`;
    //     return api(originalRequest); 
    //   } catch (error) {
    //     // Handle refresh token error or redirect to login
    //     toast.error("Session expired. Please login again.");
    //     localStorage.clear();
    //     setTimeout(() => {
    //       window.location.href = "/";
    //     }, 2000);
    //   }
    // }

    return Promise.reject(handleAPIError(error));
  },
);

// Product types
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

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Products API helper
export const productsAPI = {
  getProducts: async (params?: { limit?: number; skip?: number; search?: string }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    console.log("API: Creating product with data:", data); // Debug log
    try {
      const response = await api.post('/products/add', data);
      console.log("API: Create product response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("API: Create product error:", error); // Debug log
      throw error;
    }
  },

  updateProduct: async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<{ id: number; deleted: boolean }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;
