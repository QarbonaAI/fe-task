"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import type { ProductFormData } from "@/lib/schemas/product";
import { DataTable } from "@/components/table/data-table";
import { createProductColumns } from "@/components/products/product-columns";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const limit = 10;
  const queryClient = useQueryClient();

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => productsApi.getProducts(limit, currentPage * limit),
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products", currentPage], (old: unknown) => {
        const oldData = old as { products: Product[]; total: number } | undefined;
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: [newProduct, ...oldData.products.slice(0, limit - 1)],
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
      queryClient.setQueryData(["products", currentPage], (old: unknown) => {
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
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["products", currentPage], (old: unknown) => {
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

  const columns = createProductColumns(handleEdit, handleDelete);

  // Update document title
  useEffect(() => {
    document.title = "All Products – MyShop";
    return () => {
      document.title = "FE task QuarbonaAI";
    };
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
    <div className="min-h-screen overflow-auto px-8">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <Button onClick={() => setShowForm(true)}>Add Product</Button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.products ?? []}
            />
            
            {data && (data.total ?? 0) > limit && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {Math.ceil((data?.total ?? 0) / limit)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * limit >= data.total}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}