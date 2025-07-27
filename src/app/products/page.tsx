"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import type { ProductFormData } from "@/lib/schemas/product";
import { ProductsTable } from "@/components/products/products-table";
import { createProductColumns } from "@/components/products/product-columns";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => productsApi.getProducts(pageSize, currentPage * pageSize),
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products", currentPage, pageSize], (old: unknown) => {
        const oldData = old as { products: Product[]; total: number } | undefined;
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: [newProduct, ...oldData.products.slice(0, pageSize - 1)],
          total: oldData.total + 1,
        };
      });
      toast.success("Product created successfully");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: productsApi.updateProduct,
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["products", currentPage, pageSize], (old: unknown) => {
        const oldData = old as { products: Product[]; total: number } | undefined;
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.map((p: Product) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        };
      });
      toast.success("Product updated successfully");
      setShowForm(false);
      setEditingProduct(null);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 404) {
        toast.error("This product cannot be updated (DummyJSON API limitation)");
      } else {
        toast.error("Failed to update product");
      }
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["products", currentPage, pageSize], (old: unknown) => {
        const oldData = old as { products: Product[]; total: number } | undefined;
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.filter((p: Product) => p.id !== deletedId),
          total: oldData.total - 1,
        };
      });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleSubmit = (formData: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ ...formData, id: editingProduct.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const columns = createProductColumns(handleEdit, handleDelete);

  // Update document title
  useEffect(() => {
    document.title = "All Products MyShop";
  }, []);

  if (error) {
    return (
      <div className="min-h-screen overflow-auto">
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="text-center text-red-600">
            Error loading products. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto">
      <Navbar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <Button onClick={() => setShowForm(true)}>Add Product</Button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            {editingProduct && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Note:</strong> Due to DummyJSON API limitations, some products may not be updatable. 
                The app will simulate the update locally for demo purposes.
              </div>
            )}
            <ProductForm
              key={editingProduct?.id ?? 'new'}
              product={editingProduct ?? undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <ProductsTable
            columns={columns}
            data={data?.products ?? []}
            totalCount={data?.total ?? 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}