"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api";
import { columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductListResponse } from "@/lib/types";

export default function ProductListPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const skip = pageIndex * pageSize;

  const { data, isLoading, isError } = useQuery<ProductListResponse, Error>({
    queryKey: ["products", skip, debouncedQuery, pageSize],
    queryFn: () =>
      fetchProducts({ limit: pageSize, skip, query: debouncedQuery }),
    placeholderData: (prevData) =>
      prevData ?? { products: [], total: 0, skip, limit: pageSize },
    staleTime: 3000,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageIndex(0);
    setQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <main className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-[300px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return <div className="p-4 text-red-500">Failed to load products</div>;
  }

  return (
    <main className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Products – MyShop</h1>
        <Input
          placeholder="Search title or brand"
          value={query}
          onChange={handleSearch}
          className="w-[300px]"
        />
      </div>
      <div className="max-h-[calc(100vh-10rem)] overflow-auto">
        <DataTable
          columns={columns}
          data={data.products}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </div>
    </main>
  );
}
