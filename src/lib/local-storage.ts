import type { Product } from '@/types/product';

const LOCAL_PRODUCTS_KEY = 'local_products';
const LOCAL_UPDATES_KEY = 'local_updates';

export const localProductsStorage = {
  // Get locally created products
  getLocalProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) as Product[] : [];
  },

  // Add a locally created product
  addLocalProduct: (product: Product): void => {
    if (typeof window === 'undefined') return;
    const existing = localProductsStorage.getLocalProducts();
    const updated = [product, ...existing];
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  },

  // Get locally updated products
  getLocalUpdates: (): Record<number, Partial<Product>> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(LOCAL_UPDATES_KEY);
    return stored ? JSON.parse(stored) as Record<number, Partial<Product>> : {};
  },

  // Add a locally updated product
  addLocalUpdate: (productId: number, updates: Partial<Product>): void => {
    if (typeof window === 'undefined') return;
    const existing = localProductsStorage.getLocalUpdates();
    existing[productId] = { ...existing[productId], ...updates };
    localStorage.setItem(LOCAL_UPDATES_KEY, JSON.stringify(existing));
    console.log(`Local update stored for product ${productId}:`, updates);
    console.log('All local updates:', existing);
  },

  // Remove a locally created product (when deleted)
  removeLocalProduct: (productId: number): void => {
    if (typeof window === 'undefined') return;
    const existing = localProductsStorage.getLocalProducts();
    const filtered = existing.filter(p => p.id !== productId);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
  },

  // Clear all local data
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_PRODUCTS_KEY);
    localStorage.removeItem(LOCAL_UPDATES_KEY);
  }
};