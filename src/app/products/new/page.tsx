"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import type { ProductFormData } from "@/lib/schemas/product";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar";
import { useEffect } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Update document title
  useEffect(() => {
    document.title = "Add New Product – MyShop";
    return () => {
      document.title = "FE task QuarbonaAI";
    };
  }, []);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: (newProduct) => {
      console.log("Product created:", newProduct);
      
      // Remove all products queries from cache to force refetch
      queryClient.removeQueries({ 
        queryKey: ["products"]
      });
      
      console.log("Cache cleared, navigating back");
      toast.success("Product created successfully");
      router.push("/products");
    },
    onError: (error) => {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    },
  });

  const handleSubmit = (formData: ProductFormData) => {
    createMutation.mutate(formData);
  };

  const handleCancel = () => {
    router.push("/products");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-8 px-8">
        <div className="container mx-auto max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/products")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product by filling out the form below.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}