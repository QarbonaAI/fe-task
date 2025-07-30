"use client";
import Navbar from "@/components/navbar";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";

export const ENDPOINT = "https://dummyjson.com";

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`${ENDPOINT}/products`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Loader className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <section className="container mx-auto mt-4">
        <DataTable columns={columns} data={data.products} filters={data} />
      </section>
    </main>
  );
}
