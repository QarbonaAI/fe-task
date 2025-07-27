import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./products";
import type { Product } from "./products";

// Query keys
const PRODUCTS_KEY = ["products"];
const PRODUCT_KEY = (id: number) => ["product", id];

// Fetch products with pagination
export function useProducts({ limit = 10, skip = 0 }: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, { limit, skip }],
    queryFn: () => getProducts({ limit, skip }),
    // keepPreviousData: true, // Removed for compatibility
  });
}

// Fetch single product by ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: PRODUCT_KEY(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

// Add product mutation
export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Product, "id">> }) => updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEY(data.id) });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
} 