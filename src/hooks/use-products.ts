import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
  getProducts, 
  getProduct, 
  searchProducts, 
  getCategories, 
  getProductsByCategory,
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "@/api/products";
import type { ProductFormData } from "@/lib/schemas";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: { limit?: number; skip?: number; sortBy?: string; order?: 'asc' | 'desc' }) => 
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  byCategory: (category: string) => [...productKeys.all, "category", category] as const,
};

// Get all products with pagination and sorting
export const useProducts = (limit = 30, skip = 0, sortBy?: string, order?: 'asc' | 'desc') => {
  return useQuery({
    queryKey: productKeys.list({ limit, skip, sortBy, order }),
    queryFn: () => getProducts(limit, skip, sortBy, order),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a single product
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search products
export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: productKeys.byCategory(category),
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add product mutation
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      toast.success("Product added successfully!");
      // Invalidate and refetch products list
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Add the new product to the cache
      queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);
    },
    onError: (error) => {
      toast.error("Failed to add product. Please try again.");
      console.error("Add product error:", error);
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) => 
      updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      toast.success("Product updated successfully!");
      // Invalidate and refetch products list
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
    },
    onError: (error) => {
      toast.error("Failed to update product. Please try again.");
      console.error("Update product error:", error);
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (deletedProduct) => {
      toast.success("Product deleted successfully!");
      // Invalidate and refetch products list
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Remove the product from the cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedProduct.id) });
    },
    onError: (error) => {
      toast.error("Failed to delete product. Please try again.");
      console.error("Delete product error:", error);
    },
  });
}; 