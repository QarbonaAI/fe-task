"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productSchema, type ProductFormData } from "@/lib/schemas";
import { productsApi } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

export function ProductForm({ onClose, product }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category: product.category,
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEdit
        ? productsApi.updateProduct(product.id, data)
        : productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} product`);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Product Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("description")}
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("brand")}
              placeholder="Brand"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("category")}
              placeholder="Category"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}