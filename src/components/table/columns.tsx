"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Title
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Price
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      return `$${price.toFixed(2)}`;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Rating
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "stock",
    cell: ({ row }) => {
      const stock = row.getValue<number>("stock");
      return stock > 0 ? (
        <span className="font-medium text-green-600">✓ In Stock</span>
      ) : (
        <span className="font-medium text-red-600">✗ Out of Stock</span>
      );
    },
  },
];
