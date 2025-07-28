"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProductForm from "@/components/forms/product-form";
import type { ProductFormValues } from "@/lib/schema";

export default function EditProductClient({ product }: { product: any }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await fetch(`https://dummyjson.com/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      return res.json();
    },

    onSuccess: (updatedProduct) => {
      toast.success("Product updated");

      // Manually patch the exact page (first page, empty search)
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old?.products) return old;
        return {
          ...old,
          products: old.products.map((p: any) =>
            p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p,
          ),
        };
      });

      router.push("/products");
    },

    onError: () => {
      toast.error("Failed to update");
    },
  });

  const defaultValues: ProductFormValues = {
    title: product.title,
    description: product.description,
    price: product.price,
    rating: product.rating,
    brand: product.brand,
    thumbnail: product.thumbnail,
  };

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={(data) => mutate(data)}
        isSubmitting={isPending}
      />
    </main>
  );
}
