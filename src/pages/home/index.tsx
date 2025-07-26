// Create a new home component to show table

"use client";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { HomeController } from "./HomeController";
import { columns } from "./column";

const Home = () => {
  const { products, loading } = HomeController();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-auto max-h-[600px]">
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Home;
