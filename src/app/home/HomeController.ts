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

  // Mutation to delete product from API
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      return id;
    },
    onSuccess: (deletedId: number) => {
      // Update cache manually after successful delete
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