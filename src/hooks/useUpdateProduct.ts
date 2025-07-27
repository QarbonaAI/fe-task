import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/api/product";
import { toast } from "react-toastify";
import {type ProductFormData } from "@/types/product";

type UpdateProductArgs = {
  id: number;
  product: Partial<ProductFormData>;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: UpdateProductArgs) => updateProduct(id, product),
    onSuccess: (updatedProduct) => {
      toast.success("Product updated!");
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({ queryKey: ["products", "detail", updatedProduct.id] });
    },
    onError: () => toast.error("Failed to update product"),
  });
}