// Create new column component to show data in table

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Brand {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Category {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Rating {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Stock {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Price {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    accessorKey: "discountPercentage",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Discount % {sortIcon(column.getIsSorted())}
      </button>
    ),
  },
  {
    id: "update",
    header: "Update Here",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdate(product)}
        >
          Update
        </Button>
      );
    },
  },
  {
    id: "delete",
    header: "Delete Here",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(product.id)}
        >
          Delete
        </Button>
      );
    },
  },
];

const sortIcon = (direction: false | "asc" | "desc") => {
  return direction === "asc" ? "🔼" : direction === "desc" ? "🔽" : "↕️";
};

const handleUpdate = (product: any) => {
  console.log("Update clicked", product);
};

const handleDelete = (id: number) => {
  console.log("Delete clicked", id);
};
