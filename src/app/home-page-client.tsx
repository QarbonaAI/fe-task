"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { DataTable } from "@/components/table/data-table";
import { createProductColumns } from "@/components/table/product-columns";
import { PaginationControls } from "@/components/pagination-controls";
import { SortingIndicator } from "@/components/sorting-indicator";
import { ProductModal } from "@/components/product-modal";
import { SearchInput } from "@/components/search-input";
import { ProductSkeleton } from "@/components/product-skeleton";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useSortingStore } from "@/store/sorting";
import { sortProducts } from "@/lib/sorting";
import { type Product, type CreateProductData } from "@/api";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function HomePageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useProducts(); // Remove search parameter
  const { sorting } = useSortingStore();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  
  // Apply client-side filtering and sorting to the data
  const filteredAndSortedData = data?.products 
    ? sortProducts(
        data.products.filter(product => 
          searchQuery === "" || 
          (product.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.brand ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        ),
        sorting.sortBy, 
        sorting.sortDirection
      )
    : [];

  const handleCreateProduct = async (data: CreateProductData) => {
    console.log("HomePage: Creating product with data:", data); // Debug log
    try {
      await createProduct.mutateAsync(data);
      console.log("HomePage: Product created successfully"); // Debug log
    } catch (error) {
      console.error("HomePage: Error creating product:", error); // Debug log
      throw error;
    }
  };

  const handleUpdateProduct = async (data: CreateProductData) => {
    if (!editingProduct) return;
    await updateProduct.mutateAsync({ id: editingProduct.id, data });
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      await deleteProduct.mutateAsync(product.id);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleSubmitProduct = async (data: CreateProductData) => {
    if (editingProduct) {
      await handleUpdateProduct(data);
    } else {
      await handleCreateProduct(data);
    }
  };

  const handleRowClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const productColumns = createProductColumns({
    onEdit: handleEditProduct,
    onDelete: handleDeleteProduct,
    onRowClick: handleRowClick,
  });

  if (isLoading && !data) {
    return (
      <main className="min-h-screen overflow-auto">
        <Navbar />
        <div className="container mx-auto py-6 px-2">
          <ProductSkeleton />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen overflow-auto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-destructive mb-2">Error loading products</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="container mx-auto py-6 px-2">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage and view your product inventory.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
            <SearchInput 
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />
            <SortingIndicator />
          </div>

          <DataTable 
            columns={productColumns} 
            data={filteredAndSortedData}
            onRowClick={handleRowClick}
            isLoading={isLoading}
          />
          <PaginationControls />
        </motion.div>
      </div>

      <ProductModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
        title={editingProduct ? "Edit Product" : "Add Product"}
      />
    </main>
  );
} 