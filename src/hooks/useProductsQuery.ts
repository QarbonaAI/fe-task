import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  thumbnail: string;
  // ...other fields as needed
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface UseProductsQueryParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const API_URL = "https://dummyjson.com/products";

export function useProductsQuery({ page, pageSize, sortBy, sortOrder }: UseProductsQueryParams) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", page, pageSize, sortBy, sortOrder],
    queryFn: async () => {
      const params: Record<string, any> = {
        limit: pageSize,
        skip: page * pageSize,
      };
      if (sortBy && sortOrder) {
        params.sortBy = sortBy;
        params.order = sortOrder;
      }
      const { data } = await axios.get<ProductsResponse>(API_URL, { params });
      return data;
    },
    // @ts-ignore
    keepPreviousData: true,
  });
} 