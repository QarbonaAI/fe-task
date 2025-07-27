"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI, type Product, type CreateProductData } from "@/api";
import { usePaginationStore } from "@/store/pagination";
import { toast } from "react-toastify";

interface UseProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
}

export const useProducts = (params?: UseProductsParams) => {
  const { pagination, setTotalNext } = usePaginationStore();
  const queryClient = useQueryClient();
  
  // Calculate skip based on current page
  const skip = pagination.pageIndex * pagination.pageSize;
  
  return useQuery({
    queryKey: [
      "products", 
      { 
        ...params, 
        page: pagination.pageIndex, 
        pageSize: pagination.pageSize,
        skip
      }
    ],
    queryFn: async () => {
      const response = await productsAPI.getProducts({
        limit: pagination.pageSize,
        skip,
        search: params?.search,
      });
      
      // Update pagination store with response data
      const hasNext = skip + pagination.pageSize < response.total;
      setTotalNext(hasNext, response.total);
      
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Custom select function to handle pagination correctly
    select: (data) => {
      // Create a cache key for accumulated products
      const accumulatedKey = [
        "products-accumulated", 
        { 
          ...params, 
          pageSize: pagination.pageSize,
          search: params?.search
        }
      ];
      
      // Get existing accumulated products
      const existingAccumulated = queryClient.getQueryData(accumulatedKey) as any;
      
      if (existingAccumulated && pagination.pageIndex > 0) {
        // Check if we're going forward (higher page) or backward (lower page)
        const lastPageIndex = existingAccumulated.lastPageIndex || 0;
        
        if (pagination.pageIndex > lastPageIndex) {
          // Going forward - append new products
          const newAccumulated = {
            ...data,
            products: [...existingAccumulated.products, ...data.products],
            lastPageIndex: pagination.pageIndex,
          };
          
          // Update the accumulated cache
          queryClient.setQueryData(accumulatedKey, newAccumulated);
          
          return newAccumulated;
        } else {
          // Going backward - return only the current page data
          return {
            ...data,
            products: data.products,
            lastPageIndex: pagination.pageIndex,
          };
        }
      } else {
        // First page or no existing data, start fresh
        queryClient.setQueryData(accumulatedKey, {
          ...data,
          lastPageIndex: pagination.pageIndex,
        });
        return data;
      }
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductData) => productsAPI.createProduct(data),
    onMutate: async (newProduct) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });
      await queryClient.cancelQueries({ queryKey: ["products-accumulated"] });

      // Snapshot the previous values
      const previousProducts = queryClient.getQueryData(["products"]);
      const previousAccumulated = queryClient.getQueryData(["products-accumulated"]);

      // Create optimistic product
      const optimisticProduct: Product = {
        id: Date.now(), // Temporary ID
        ...newProduct,
        images: newProduct.images || [],
        thumbnail: newProduct.thumbnail || "",
      };

      // Update all products queries
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: [optimisticProduct, ...old.products],
          total: old.total + 1,
        };
      });

      // Update accumulated cache
      queryClient.setQueryData(["products-accumulated"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: [optimisticProduct, ...old.products],
          total: old.total + 1,
        };
      });

      return { previousProducts, previousAccumulated };
    },
    onError: (err, newProduct, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      if (context?.previousAccumulated) {
        queryClient.setQueryData(["products-accumulated"], context.previousAccumulated);
      }
      toast.error("Failed to create product. Please try again.");
    },
    // For DummyJSON: Do NOT refetch after create, so optimistic update remains
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["products"] });
      // queryClient.invalidateQueries({ queryKey: ["products-accumulated"] });
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateProductData> }) =>
      productsAPI.updateProduct(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });
      await queryClient.cancelQueries({ queryKey: ["products-accumulated"] });
      await queryClient.cancelQueries({ queryKey: ["product", id] });

      // Snapshot the previous values
      const previousProducts = queryClient.getQueryData(["products"]);
      const previousAccumulated = queryClient.getQueryData(["products-accumulated"]);
      const previousProduct = queryClient.getQueryData(["product", id]);

      // Update function for products arrays
      const updateProductsArray = (products: Product[]) =>
        products.map((product: Product) =>
          product.id === id ? { ...product, ...data } : product
        );

      // Optimistically update products list
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: updateProductsArray(old.products),
        };
      });

      // Optimistically update accumulated cache
      queryClient.setQueryData(["products-accumulated"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: updateProductsArray(old.products),
        };
      });

      // Optimistically update individual product
      queryClient.setQueryData(["product", id], (old: any) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      return { previousProducts, previousAccumulated, previousProduct };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      if (context?.previousAccumulated) {
        queryClient.setQueryData(["products-accumulated"], context.previousAccumulated);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(["product", variables.id], context.previousProduct);
      }
      toast.error("Failed to update product. Please try again.");
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-accumulated"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productsAPI.deleteProduct(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });
      await queryClient.cancelQueries({ queryKey: ["products-accumulated"] });

      // Snapshot the previous values
      const previousProducts = queryClient.getQueryData(["products"]);
      const previousAccumulated = queryClient.getQueryData(["products-accumulated"]);

      // Update function for products arrays
      const filterProductsArray = (products: Product[]) =>
        products.filter((product: Product) => product.id !== deletedId);

      // Optimistically update products list
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: filterProductsArray(old.products),
          total: old.total - 1,
        };
      });

      // Optimistically update accumulated cache
      queryClient.setQueryData(["products-accumulated"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: filterProductsArray(old.products),
          total: old.total - 1,
        };
      });

      // Remove individual product cache
      queryClient.removeQueries({ queryKey: ["product", deletedId] });

      return { previousProducts, previousAccumulated };
    },
    onError: (err, deletedId, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      if (context?.previousAccumulated) {
        queryClient.setQueryData(["products-accumulated"], context.previousAccumulated);
      }
      toast.error("Failed to delete product. Please try again.");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-accumulated"] });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
    },
  });
}; 