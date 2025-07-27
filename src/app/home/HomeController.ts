// Create controller to fetch and delete product

"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export const HomeController = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("https://dummyjson.com/products");
      return res.data.products;
    },
    staleTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      return id;
    },
    onSuccess: (deletedId: number) => {
      queryClient.setQueryData(["products"], (old: any[] = []) =>
        old.filter((item) => item.id !== deletedId),
      );
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    products,
    loading: isLoading,
    handleDelete,
  };
};
