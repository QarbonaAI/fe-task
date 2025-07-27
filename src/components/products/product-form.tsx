"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/schemas/product";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
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
      rating: product.rating,
      stock: product.stock,
    } : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Input
          id="description"
          {...register("description")}
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="Enter price"
        />
        {errors.price && (
          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Rating
        </label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          {...register("rating", { valueAsNumber: true })}
          placeholder="Enter rating"
        />
        {errors.rating && (
          <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="brand" className="block text-sm font-medium mb-1">
          Brand
        </label>
        <Input
          id="brand"
          {...register("brand")}
          placeholder="Enter brand"
        />
        {errors.brand && (
          <p className="text-sm text-red-600 mt-1">{errors.brand.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Input
          id="category"
          {...register("category")}
          placeholder="Enter category"
        />
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium mb-1">
          Stock
        </label>
        <Input
          id="stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          placeholder="Enter stock quantity"
        />
        {errors.stock && (
          <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}