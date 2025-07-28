import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import type { CreateProductData, UpdateProductData, Product } from "@/types/product";

export const PRODUCTS_QUERY_KEY = "products";

export const useProducts = (params: {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
} = {}) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 10 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productsApi.createProduct(data),
    
    // Optimistic update: immediately add product to cache
    onMutate: async (newProduct) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

      const tempId = Date.now();

      const optimisticProduct: Product = {
        id: tempId,
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
        discountPercentage: newProduct.discountPercentage ?? 0,
        rating: newProduct.rating ?? 1,
        stock: newProduct.stock,
        brand: newProduct.brand ?? "",
        sku: newProduct.sku ?? "",
        weight: newProduct.weight ?? 0,
        dimensions: newProduct.dimensions ?? { width: 0, height: 0, depth: 0 },
        warrantyInformation: newProduct.warrantyInformation ?? "",
        shippingInformation: newProduct.shippingInformation ?? "",
        availabilityStatus: newProduct.availabilityStatus ?? "In Stock",
        returnPolicy: newProduct.returnPolicy ?? "",
        minimumOrderQuantity: newProduct.minimumOrderQuantity ?? 1,
        thumbnail: newProduct.thumbnail ?? "",
        images: [],
        tags: [],
        reviews: [],
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          barcode: "",
          qrCode: "",
          isLocalOnly: true,
        }
      };

      const previousQueries = new Map();
      
      // Update all product list queries
      const queries = queryClient.getQueryCache().findAll({
        queryKey: [PRODUCTS_QUERY_KEY]
      });

      queries.forEach(query => {
        if (query.queryKey.length >= 2 && typeof query.queryKey[1] === 'object') {
          const params = query.queryKey[1] as { skip?: number; limit?: number };
          const oldData = query.state.data;
          
          if (oldData && typeof oldData === 'object') {
            const typedOldData = oldData as { products: Product[]; total: number; skip: number; limit: number };
            
            if (typedOldData.products) {
              previousQueries.set(query.queryKey, typedOldData);
              
              // Add to first page only
              if (params.skip === 0) {
                queryClient.setQueryData(query.queryKey, {
                  ...typedOldData,
                  products: [optimisticProduct, ...typedOldData.products],
                  total: typedOldData.total + 1
                });
              } else {
                // Update total count for other pages
                queryClient.setQueryData(query.queryKey, {
                  ...typedOldData,
                  total: typedOldData.total + 1
                });
              }
            }
          }
        }
      });

      return { previousQueries, tempId };
    },

    onError: (err, newProduct, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    
    onSuccess: () => {
      // On success: do nothing (keep optimistic update)
      // API call succeeded, keep the optimistic update as is
      // No need to invalidate or refetch since optimistic update is already in place
    },
  });
};

const isLocalProduct = (queryClient: ReturnType<typeof useQueryClient>, productId: number): boolean => {
  const queries = queryClient.getQueryCache().findAll({
    queryKey: [PRODUCTS_QUERY_KEY]
  });
  
  for (const query of queries) {
    if (query.queryKey.length >= 2 && typeof query.queryKey[1] === 'object') {
      const data = query.state.data;
      if (data && typeof data === 'object') {
        const typedData = data as { products: Product[] };
        const product = typedData.products?.find(p => p.id === productId);
        console.log("DEBUG isLocalProduct:", { productId, product, isLocal: product?.meta?.isLocalOnly });
        if (product?.meta?.isLocalOnly) {
          return true;
        }
      }
    }
  }
  return false;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) => {
      if (isLocalProduct(queryClient, data.id)) {
        // For local products, don't make API call - just return success
        return Promise.resolve(data as Product);
      }
      // For existing products, make API call
      return productsApi.updateProduct(data);
    },
    
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      const previousQueries = new Map();

      // Update all product list queries
      const queries = queryClient.getQueryCache().findAll({
        queryKey: [PRODUCTS_QUERY_KEY]
      });

      queries.forEach(query => {
        if (query.queryKey.length >= 2 && typeof query.queryKey[1] === 'object') {
          const oldData = query.state.data;
          
          if (oldData && typeof oldData === 'object') {
            const typedOldData = oldData as { products: Product[]; total: number; skip: number; limit: number };
            
            if (typedOldData.products) {
              previousQueries.set(query.queryKey, typedOldData);
              
              // Update the product
              queryClient.setQueryData(query.queryKey, {
                ...typedOldData,
                products: typedOldData.products.map(product => 
                  product.id === updatedProduct.id 
                    ? { ...product, ...updatedProduct }
                    : product
                )
              });
            }
          }
        }
      });

      // Update single product cache if exists
      queryClient.setQueryData([PRODUCTS_QUERY_KEY, updatedProduct.id], (old: unknown) => {
        if (old && typeof old === 'object') {
          const oldProduct = old as Product;
          return { ...oldProduct, ...updatedProduct };
        }
        return old;
      });

      return { previousQueries };
    },

    onError: (err, updatedProduct, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    
    onSuccess: () => {
      // On success: do nothing (keep optimistic update)
      // API call succeeded, keep the optimistic update as is
      // No need to invalidate or refetch since optimistic update is already in place
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // The check for local vs existing will be done in onMutate
      // This function will be called with the decision already made
      return { isDeleted: true, id };
    },
    
    onMutate: async (productId) => {
      
      // Check if this is a locally created product BEFORE we modify the cache
      const isLocal = isLocalProduct(queryClient, productId);
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

      const previousQueries = new Map();

      const queries = queryClient.getQueryCache().findAll({
        queryKey: [PRODUCTS_QUERY_KEY]
      });


      queries.forEach(query => {
        if (query.queryKey.length >= 2 && typeof query.queryKey[1] === 'object') {
          const oldData = query.state.data;
          
          if (oldData && typeof oldData === 'object') {
            const typedOldData = oldData as { products: Product[]; total: number; skip: number; limit: number };
            
            if (typedOldData.products) {
              previousQueries.set(query.queryKey, typedOldData);
              
              // Remove the product
              const newProducts = typedOldData.products.filter(product => product.id !== productId);
              
              queryClient.setQueryData(query.queryKey, {
                ...typedOldData,
                products: newProducts,
                total: typedOldData.total - 1
              });
            }
          }
        }
      });

      queryClient.removeQueries({ queryKey: [PRODUCTS_QUERY_KEY, productId] });
      return { previousQueries, isLocal };
    },

    onError: (err, productId, context) => {
      console.log("DEBUG DELETE onError:", err);
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // On success: make API call only for existing products
    onSuccess: async (data, productId, context) => {
      
      // If it's NOT a local product, make the actual API call
      if (!context?.isLocal) {
        try {
          await productsApi.deleteProduct(productId);
        } catch {
          // If API call fails, rollback the optimistic update
          if (context?.previousQueries) {
            context.previousQueries.forEach((data, queryKey) => {
              queryClient.setQueryData(queryKey, data);
            });
          }
        }
      } else {
        // If product is local, no need to make api call
      }
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, "search", query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
