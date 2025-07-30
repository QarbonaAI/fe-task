"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0.01, "Price must be positive"),
  brand: z.string().min(1, "Brand is required"),
});
type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({
  onSubmit,
  onClose,
  defaultValues,
}: {
  onSubmit: (values: ProductFormValues) => void;
  onClose: () => void;
  defaultValues?: Partial<ProductFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset();
      })}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{defaultValues ? "Edit" : "Add"} Product</h2>
        
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            {...register("title")}
            className={clsx(
              "w-full border rounded px-3 py-2 focus:outline-none",
              errors.title ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Product title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="description">Description</label>
          <input
            id="description"
            {...register("description")}
            className={clsx(
              "w-full border rounded px-3 py-2 focus:outline-none",
              errors.description ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Product description"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className={clsx(
              "w-full border rounded px-3 py-2 focus:outline-none",
              errors.price ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Product price"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1" htmlFor="brand">Brand</label>
          <input
            id="brand"
            {...register("brand")}
            className={clsx(
              "w-full border rounded px-3 py-2 focus:outline-none",
              errors.brand ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Product brand"
          />
          {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit">{defaultValues ? "Update" : "Add"}</Button>
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}