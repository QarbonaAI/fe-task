import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/product";
import { toast } from "react-toastify";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      toast.success("Product deleted!");
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.removeQueries({ queryKey: ["products", "detail", id] });
    },
    onError: () => toast.error("Failed to delete product"),
  });
}