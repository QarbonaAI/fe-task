"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/table/data-table";
import { createProductColumns } from "@/components/products/product-columns";
import { ProductForm } from "@/components/products/product-form";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { Plus, Search, X } from "lucide-react";
import type { Product } from "@/types/product";
import type { ProductFormData } from "@/lib/schemas";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Calculate skip for pagination
  const skip = (currentPage - 1) * pageSize;

  // Fetch products with pagination and sorting
  const { data: productsData, isLoading, error } = useProducts(pageSize, skip, sortBy, sortOrder);

  // Mutations
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Create table columns
  const columns = useMemo(() => 
    createProductColumns(
      (product) => {
        setEditingProduct(product);
        setShowEditForm(true);
      },
      (product) => {
        if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
          deleteProductMutation.mutate(product.id);
        }
      }
    ),
    [deleteProductMutation]
  );

  // Handle form submissions
  const handleAddProduct = (data: ProductFormData) => {
    addProductMutation.mutate(data, {
      onSuccess: () => {
        setShowAddForm(false);
      },
    });
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate(
        { id: editingProduct.id, data },
        {
          onSuccess: () => {
            setShowEditForm(false);
            setEditingProduct(null);
          },
        }
      );
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
          <p className="text-slate-600 dark:text-slate-300">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Products</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage your product catalog with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search products by title or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={productsData?.products ?? []}
          />
        )}
      </div>

      {/* Pagination Info */}
      {productsData && (
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Showing {skip + 1} to {Math.min(skip + pageSize, productsData.total)} of {productsData.total} products
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add New Product</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddForm(false)}
                isLoading={addProductMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Product</h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                  }}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ProductForm
                product={editingProduct}
                onSubmit={handleUpdateProduct}
                onCancel={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
                isLoading={updateProductMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 