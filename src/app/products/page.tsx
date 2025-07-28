"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { ProductForm } from "@/components/products/product-form";
import { ProductSearch } from "@/components/products/product-search";
import { createProductColumns } from "@/components/products/product-columns";
import { ProductTableSkeleton } from "@/components/products/product-skeletons";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import type { Product, ProductsResponse } from "@/types/product";
import type { ProductFormData } from "@/schemas/product";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchResults, setSearchResults] = useState<ProductsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const skip = currentPage * PAGE_SIZE;
  
  const queryParams = useMemo(() => ({
    limit: PAGE_SIZE,
    skip
  }), [skip]);
  
  const { data: productsData, isLoading, error } = useProducts(queryParams);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const displayData = isSearching ? searchResults : productsData;

  // Form handlers
  const handleCreateProduct = (data: ProductFormData) => {
    setIsFormOpen(false);
    
    createProductMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Product created successfully!");
      },
      onError: (error) => {
        toast.error(`Failed to create product: ${error.message}`);
      },
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (!editingProduct) return;
    const currentEditingProduct = editingProduct;
    
    setIsFormOpen(false);
    setEditingProduct(null);
    
    updateProductMutation.mutate(
      { ...data, id: currentEditingProduct.id },
      {
        onSuccess: () => {
          toast.success("Product updated successfully!");
        },
        onError: (error) => {
          toast.error(`Failed to update product: ${error.message}`);
        },
      }
    );
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Failed to delete product: ${error.message}`);
        },
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSearchResults = useCallback((results: ProductsResponse) => {
    setSearchResults(results);
    setIsSearching(true);
    setCurrentPage(0);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchResults(null);
    setIsSearching(false);
    setCurrentPage(0);
  }, []);

  const columns = createProductColumns({
    onEdit: handleEditProduct,
    onDelete: handleDeleteProduct,
  });

  // Create pagination info for the table
  const paginationInfo = useMemo(() => {
    if (!displayData) return null;
    
    const totalPages = Math.ceil(displayData.total / PAGE_SIZE);
    const hasNextPage = currentPage < totalPages - 1;
    const hasPreviousPage = currentPage > 0;
    
    return {
      totalPages,
      hasNextPage,
      hasPreviousPage,
      currentPage: currentPage + 1,
      totalItems: displayData.total,
      startItem: skip + 1,
      endItem: Math.min(skip + PAGE_SIZE, displayData.total),
    };
  }, [displayData, currentPage, skip]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Products</h2>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex gap-4 w-full justify-center">
          <div className="w-lg">
            <ProductSearch
              onResults={handleSearchResults}
              onClear={handleSearchClear}
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {paginationInfo && !isSearching && (
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center space-x-2 w-full justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={!paginationInfo.hasPreviousPage || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!paginationInfo.hasNextPage || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {isSearching && searchResults && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground text-center">
            Found {searchResults.total} products matching your search
          </p>
        </div>
      )}

      {isLoading && !isSearching ? (
        <ProductTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={displayData?.products ?? []}
        />
      )}

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
        isLoading={
          createProductMutation.isPending || updateProductMutation.isPending
        }
      />
    </div>
  );
}
