import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product";

export function useProductsList(limit = 10, skip = 0) {
  return useQuery({
    queryKey: ["products", "list", { limit, skip }],
    queryFn: () => getProducts(limit, skip),
    staleTime: 5 * 60 * 1000,
  });
}