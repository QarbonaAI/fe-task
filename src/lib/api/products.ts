import axios from 'axios';
import type { Product, ProductsResponse, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import { localProductsStorage } from '../local-storage';

const API_BASE = 'https://dummyjson.com';

export const productsApi = {
  // Get all products with pagination
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    const apiData = response.data as ProductsResponse;
    
    // Get local products and updates
    const localProducts = localProductsStorage.getLocalProducts();
    const localUpdates = localProductsStorage.getLocalUpdates();
    
    // Apply local updates to API products
    const updatedApiProducts = apiData.products.map(product => {
      const updates = localUpdates[product.id];
      if (updates) {
        console.log(`Applying local updates to product ${product.id}:`, updates);
        return { ...product, ...updates };
      }
      return product;
    });
    
    // If we're on the first page, prepend local products
    if (skip === 0) {
      const localProductsToShow = localProducts.slice(0, limit);
      const remainingSlots = limit - localProductsToShow.length;
      const apiProductsToShow = updatedApiProducts.slice(0, remainingSlots);
      
      return {
        ...apiData,
        products: [...localProductsToShow, ...apiProductsToShow],
        total: apiData.total + localProducts.length,
      };
    }
    
    // For other pages, just return updated API products
    return {
      ...apiData,
      products: updatedApiProducts,
      total: apiData.total + localProducts.length,
    };
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get(`${API_BASE}/products/${id}`);
      return response.data as Product;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status: number } };
      
      // If product not found in API, check if it's a locally created product
      if (axiosError.response?.status === 404) {
        const localProducts = localProductsStorage.getLocalProducts();
        const localProduct = localProducts.find(p => p.id === id);
        
        if (localProduct) {
          console.log("Found locally created product:", localProduct);
          return localProduct;
        }
      }
      
      throw error;
    }
  },

  // Create product
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    console.log("Creating product:", product);
    const response = await axios.post(`${API_BASE}/products/add`, product);
    console.log("Create response:", response.data);
    
    const newProduct = response.data as Product;
    
    // Store locally since DummyJSON doesn't persist
    localProductsStorage.addLocalProduct(newProduct);
    console.log("Product stored locally");
    
    return newProduct;
  },

  // Update product
  updateProduct: async (product: UpdateProductRequest): Promise<Product> => {
    console.log("Updating product:", product);
    try {
      const updatePayload = {
        title: product.title,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        rating: product.rating,
        stock: product.stock,
      };
      console.log("API update payload:", updatePayload);
      const response = await axios.put(`${API_BASE}/products/${product.id}`, updatePayload);
      console.log("Update response:", response.data);
      const updatedProduct = response.data as Product;
      
      // Store the update locally for consistency
      localProductsStorage.addLocalUpdate(product.id, {
        title: product.title,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        rating: product.rating,
        stock: product.stock,
      });
      
      return updatedProduct;
    } catch (error: unknown) {
      console.log("Update failed, using fallback:", error);
      const axiosError = error as { response?: { data: unknown; status: number } };
      console.log("Error status:", axiosError.response?.status);
      console.log("Error data:", axiosError.response?.data);
      
      // DummyJSON API limitation: some products can't be updated
      // For demo purposes, we'll simulate the update locally
      if (axiosError.response?.status === 404 || axiosError.response?.status === 400) {
        const simulatedProduct = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          brand: product.brand,
          category: product.category,
          discountPercentage: 0,
          rating: 4.5,
          stock: 100,
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
        } as Product;
        
        // Store the update locally
        localProductsStorage.addLocalUpdate(product.id, {
          title: product.title,
          description: product.description,
          price: product.price,
          brand: product.brand,
          category: product.category,
          rating: product.rating,
          stock: product.stock,
        });
        
        console.log("Update stored locally, returning simulated product:", simulatedProduct);
        return simulatedProduct;
      }
      
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    try {
      const response = await axios.delete(`${API_BASE}/products/${id}`);
      
      // Remove from local storage if it exists
      localProductsStorage.removeLocalProduct(id);
      
      return response.data as { id: number; isDeleted: boolean };
    } catch {
      // If API delete fails, still remove from local storage
      localProductsStorage.removeLocalProduct(id);
      return { id, isDeleted: true };
    }
  },
};