import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/product";

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}