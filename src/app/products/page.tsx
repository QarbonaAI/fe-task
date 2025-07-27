"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { ProductsTable } from "@/components/products/products-table";
import { createProductColumns } from "@/components/products/product-columns";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => {
      console.log("Fetching products:", { pageSize, skip: currentPage * pageSize });
      return productsApi.getProducts(pageSize, currentPage * pageSize);
    },
  });

  // Debug: log when data changes
  useEffect(() => {
    console.log("Products data updated:", data);
  }, [data]);



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

  const handleEdit = (product: Product) => {
    router.push(`/products/edit/${product.id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
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
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-8 px-8">
          <div className="container mx-auto">
            <div className="text-center text-red-600">
              Error loading products. Please try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-8 px-8">
        <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <Button onClick={() => router.push("/products/new")}>Add Product</Button>
        </div>

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
    </div>
  );
}