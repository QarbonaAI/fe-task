"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { ProductActions } from "../ProductActions";
import { Button } from "../ui/button";
import Link from "next/link";

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
    id: "view",
    cell: ({ row }) => (
      <Button
        variant="outline"
        className="rounded-full px-2.5"
        title="View Product Details"
      >
        <Link
          href={`/products/${row.original.id}`}
          className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
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
      return `${price.toFixed(2)}`;
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
];
