"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { Product } from "@/types/product";

interface ProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const createProductColumns = ({ onEdit, onDelete }: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        <span className="font-medium">{row.getValue("id")}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => {
      const thumbnail: string = row.getValue("thumbnail");
      const title: string = row.getValue("title");
      return (
        <div className="w-16 h-16 relative">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover rounded-md"
            sizes="64px"
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      const id: number | string = row.getValue("id");
      
      return (
        <Link 
          href={`/products/${id}`}
          className="font-medium hover:underline max-w-[200px] truncate block"
        >
          {title}
        </Link>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.getValue("brand") ?? "N/A"}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.getValue("category")}
      </div>
    ),
    enableSorting: false,
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
    enableSorting: true,
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating: number = row.getValue("rating");
      return (
        <div className="flex items-center">
          <span className="font-medium">{rating?.toFixed(1)}</span>
          <span className="text-yellow-500 ml-1">★</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock: number  = row.getValue("stock");
      return (
        <div className={`font-medium ${stock < 10 ? "text-red-500" : stock < 50 ? "text-yellow-500" : "text-green-500"}`}>
          {stock}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "availabilityStatus",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("availabilityStatus");
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === "In Stock" 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : status === "Low Stock"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }`}>
          {status || "Unknown"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product.id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
