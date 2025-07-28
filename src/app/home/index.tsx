// Create a new home component to show table

"use client";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { HomeController } from "./HomeController";
import { columns } from "./column";
import { useRouter } from "next/navigation";

const Home = () => {
  const { products, loading, handleDelete } = HomeController();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-auto max-h-[600px]">
      <DataTable 
        columns={columns({ handleDelete, router })} 
        data={products}
        onRowClick={(product) => {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          router.push(`/product/view/${product.id}`);
        }}
      />
    </div>
  );
};

export default Home;
