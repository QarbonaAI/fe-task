"use client";

import ProductForm from "@/components/forms/product-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductFormValues } from "@/lib/schema";

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Server error");
      return res.json();
    },
    onSuccess: (newProduct) => {
      toast.success("Product added successfully");

      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: [newProduct, ...old.products],
        };
      });

      router.push("/products");
    },
    onError: () => toast.error("Failed to add product"),
  });

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <ProductForm onSubmit={(data) => mutate(data)} isSubmitting={isPending} />
    </main>
  );
}
