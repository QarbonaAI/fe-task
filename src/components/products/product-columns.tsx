"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ProductTitleCell({ product, title }: { product: Product; title: string }) {
  const router = useRouter();
  return (
    <Button
      variant="link"
      className="p-0 h-auto font-medium text-left justify-start"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {title}
    </Button>
  );
}

export const createProductColumns = (
  onEdit: (product: Product) => void,
  onDelete: (id: number) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <ProductTitleCell product={row.original} title={String(row.getValue("title"))} />
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
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
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row.original}
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original.id)}
      />
    ),
  },
];