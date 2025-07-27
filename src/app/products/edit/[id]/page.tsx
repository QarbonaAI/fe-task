"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import type { ProductFormData } from "@/lib/schemas/product";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar";
import { useEffect } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = parseInt(params.id as string);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsApi.getProduct(productId),
    enabled: !isNaN(productId),
  });

  // Update document title
  useEffect(() => {
    if (product) {
      document.title = `Edit ${product.title} – MyShop`;
    } else {
      document.title = "Edit Product – MyShop";
    }
    return () => {
      document.title = "FE task QuarbonaAI";
    };
  }, [product]);

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: productsApi.updateProduct,
    onSuccess: (updatedProduct) => {
      console.log("Product updated:", updatedProduct);
      
      // Remove all products queries from cache to force refetch
      queryClient.removeQueries({ 
        queryKey: ["products"]
      });
      
      // Remove the individual product query
      queryClient.removeQueries({ 
        queryKey: ["product", productId]
      });
      
      console.log("Cache cleared, navigating back");
      toast.success("Product updated successfully");
      router.push("/products");
    },
    onError: (error: unknown) => {
      console.error("Update product error:", error);
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 404) {
        toast.error("This product cannot be updated (DummyJSON API limitation)");
      } else {
        toast.error("Failed to update product");
      }
    },
  });

  const handleSubmit = (formData: ProductFormData) => {
    console.log("Form data submitted:", formData);
    if (product) {
      const updateData = { ...formData, id: product.id };
      console.log("Update data being sent:", updateData);
      updateMutation.mutate(updateData);
    }
  };

  const handleCancel = () => {
    router.push("/products");
  };

  if (isNaN(productId)) {
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
            <div className="text-center text-red-600">Invalid product ID</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="text-center text-red-600">
              Error loading product. Please try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
            <div className="text-center py-8">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
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
            <div className="text-center">Product not found</div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
            <p className="text-muted-foreground">
              Update the product information below.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}