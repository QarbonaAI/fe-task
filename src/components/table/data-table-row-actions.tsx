"use client";

import { MoreHorizontal } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { productsApi } from "@/api/products";
import { ProductForm } from "@/components/product-form";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";
import { toast } from "react-toastify";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showEditForm, setShowEditForm] = useState(false);
  const queryClient = useQueryClient();
  const product = row.original as any;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowEditForm(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showEditForm && (
        <ProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}
