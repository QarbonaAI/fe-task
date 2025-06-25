"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { productsApi, type Product } from "@/api/products";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page],
    queryFn: () => productsApi.getProducts(limit, page * limit),
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium cursor-pointer" 
             onClick={() => router.push(`/products/${row.original.id}`)}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Brand" />
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div className="font-medium">${price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        const rating = parseFloat(row.getValue("rating"));
        return <div>{rating.toFixed(1)}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Products – MyShop</h1>
        <Button onClick={() => setShowForm(true)}>Add Product</Button>
      </div>
      
      {showForm && (
        <ProductForm onClose={() => setShowForm(false)} />
      )}
      
      <DataTable
        columns={columns}
        data={data?.products || []}
      />
    </div>
  );
}