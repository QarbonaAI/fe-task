"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { ProductForm } from "./product-form";
import { type Product, type ProductFormData } from "@/types/product";
import { useAddProduct } from "@/hooks/useAddProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";

interface AddProductDialogProps {
  onSuccess?: () => void;
}

export function AddProductDialog({ onSuccess }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const addProduct = useAddProduct();

  const handleSubmit = (data: ProductFormData) => {
    addProduct.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={addProduct.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditProductDialogProps {
  product: Product;
  onSuccess?: () => void;
}

export function EditProductDialog({ product, onSuccess }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const updateProduct = useUpdateProduct();

  const handleSubmit = (data: ProductFormData) => {
    updateProduct.mutate(
      { id: product.id, product: data },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={updateProduct.isPending}
        />
      </DialogContent>
    </Dialog>
  );
} 