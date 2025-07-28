import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "@/lib/ProductActions";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.id}`}
        className="text-blue-600 underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = Number(getValue());
      return isNaN(value) ? "-" : `$${value.toFixed(2)}`;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
];
