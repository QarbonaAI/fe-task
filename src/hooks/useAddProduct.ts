import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "@/api/product";
import { toast } from "react-toastify";

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Product added!");
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
    },
    onError: () => toast.error("Failed to add product"),
  });
}