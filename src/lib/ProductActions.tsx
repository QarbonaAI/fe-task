"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

type Props = {
  product: {
    id: number;
    title: string;
  };
};

export function ProductActions({ product }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: (_res, id) => {
      toast.success("Product deleted");
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old?.products) return old;
        return {
          ...old,
          products: old.products.filter((p: any) => p.id !== product.id),
        };
      });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  return (
    <DataTableRowActions
      row={product}
      onEdit={() => router.push(`/products/edit/${product.id}`)}
      onDelete={() => {
        if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
          deleteProduct(product.id);
        }
      }}
    />
  );
}
