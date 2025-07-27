"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema } from "@/api/products";
import type { Product } from "@/api/products";
import { z } from "zod";

export type ProductFormValues = z.infer<typeof productCreateSchema>;

export default function ProductForm({
  initialValues,
  onSubmit,
  loading,
}: {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: initialValues || {},
  });

  return (
    <form
      onSubmit={handleSubmit((values: ProductFormValues) => {
        onSubmit(values);
        reset();
      })}
      className="space-y-2"
    >
      <div>
        <label className="block font-medium text-sm mb-1">Title</label>
        <input {...register("title")}
          className="border rounded px-2 py-1 w-full text-sm" />
        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block font-medium text-sm mb-1">Description</label>
        <textarea {...register("description")}
          className="border rounded px-2 py-1 w-full text-sm" rows={2} />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium text-sm mb-1">Price</label>
          <input type="number" step="0.01" {...register("price", { valueAsNumber: true })}
            className="border rounded px-2 py-1 w-full text-sm" />
          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block font-medium text-sm mb-1">Discount (%)</label>
          <input type="number" step="0.01" {...register("discountPercentage", { valueAsNumber: true })}
            className="border rounded px-2 py-1 w-full text-sm" />
          {errors.discountPercentage && <p className="text-red-600 text-xs mt-1">{errors.discountPercentage.message}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium text-sm mb-1">Rating</label>
          <input type="number" step="0.01" {...register("rating", { valueAsNumber: true })}
            className="border rounded px-2 py-1 w-full text-sm" />
          {errors.rating && <p className="text-red-600 text-xs mt-1">{errors.rating.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block font-medium text-sm mb-1">Stock</label>
          <input type="number" {...register("stock", { valueAsNumber: true })}
            className="border rounded px-2 py-1 w-full text-sm" />
          {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message}</p>}
        </div>
      </div>
      <div>
        <label className="block font-medium text-sm mb-1">Brand</label>
        <input {...register("brand")}
          className="border rounded px-2 py-1 w-full text-sm" />
        {errors.brand && <p className="text-red-600 text-xs mt-1">{errors.brand.message}</p>}
      </div>
      <div>
        <label className="block font-medium text-sm mb-1">Category</label>
        <input {...register("category")}
          className="border rounded px-2 py-1 w-full text-sm" />
        {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
      </div>
      <div>
        <label className="block font-medium text-sm mb-1">Thumbnail URL</label>
        <input {...register("thumbnail")}
          className="border rounded px-2 py-1 w-full text-sm" />
        {errors.thumbnail && <p className="text-red-600 text-xs mt-1">{errors.thumbnail.message}</p>}
      </div>
      <div>
        <label className="block font-medium text-sm mb-1">Images (comma separated URLs)</label>
        <input {...register("images", {
          setValueAs: (v: string) =>
            typeof v === "string"
              ? v.split(",").map((s: string) => s.trim()).filter(Boolean)
              : [],
        })}
          className="border rounded px-2 py-1 w-full text-sm" />
        {errors.images && <p className="text-red-600 text-xs mt-1">{errors.images.message as string}</p>}
      </div>
      <button
        type="submit"
        className="px-4 py-1.5 bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700 transition text-sm"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
} 