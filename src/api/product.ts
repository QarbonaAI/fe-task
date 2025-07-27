import api from "@/api/index";
import { type Product, type ProductsResponse, type ProductFormData } from "@/types/product";

export const getProducts = async (limit = 10, skip = 0): Promise<ProductsResponse> => {
  const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: ProductFormData) => {
  const response = await api.post("/products/add", product);
  return response.data;
};

export const updateProduct = async (id: number, product: Partial<ProductFormData>) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
