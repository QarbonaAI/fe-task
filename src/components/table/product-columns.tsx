"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./data-table-column-header";
import { type Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { EditProductDialog } from "@/components/forms/product-dialog";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => router.push(`/products/${row.original.id}`)}
        >
          {row.getValue("title")}
        </Button>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Brand" />,
    cell: ({ row }) => <div>{row.getValue("brand")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"));
      return <div className="flex items-center">{rating.toFixed(1)} ⭐</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock} in stock
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ProductRowActions product={row.original} />,
  },
];

function ProductRowActions({ product }: { product: Product }) {
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(product.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <EditProductDialog product={product} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={deleteProduct.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 