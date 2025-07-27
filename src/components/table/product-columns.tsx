"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Product } from "@/api";

const SortIcon = ({ isSorted, isSortedDesc }: { isSorted: boolean; isSortedDesc: boolean }) => {
  if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />;
  return isSortedDesc ? (
    <ArrowDown className="ml-2 h-4 w-4" />
  ) : (
    <ArrowUp className="ml-2 h-4 w-4" />
  );
};

interface ProductColumnsProps {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onRowClick?: (product: Product) => void;
}

export const createProductColumns = ({ onEdit, onDelete, onRowClick }: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          ID
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Title
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[200px] truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Brand
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("brand")}</Badge>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Category
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Price
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
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
    accessorKey: "discountPercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Discount
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const discount = row.getValue("discountPercentage") as number;
      return (
        <Badge variant={discount > 0 ? "destructive" : "secondary"}>
          {discount > 0 ? `-${discount}%` : "No discount"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Rating
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-muted"
        >
          Stock
          <SortIcon isSorted={column.getIsSorted() !== false} isSortedDesc={column.getIsSorted() === "desc"} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(product.id.toString());
              }}
            >
              Copy product ID
            </DropdownMenuItem>
            {onRowClick && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRowClick(product);
              }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit product
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete product
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 