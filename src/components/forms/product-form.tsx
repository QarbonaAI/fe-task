"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-md space-y-4"
    >
      <div>
        <label>Title</label>
        <Input {...register("title")} />
        <p className="text-sm text-red-500">{errors.title?.message}</p>
      </div>
      <div>
        <label>Description</label>
        <Input {...register("description")} />
        <p className="text-sm text-red-500">{errors.description?.message}</p>
      </div>
      <div>
        <label>Price</label>
        <Input type="number" {...register("price")} />
        <p className="text-sm text-red-500">{errors.price?.message}</p>
      </div>
      <div>
        <label>Rating</label>
        <Input type="number" {...register("rating")} />
        <p className="text-sm text-red-500">{errors.rating?.message}</p>
      </div>
      <div>
        <label>Brand</label>
        <Input {...register("brand")} />
        <p className="text-sm text-red-500">{errors.brand?.message}</p>
      </div>
      <div>
        <label>Thumbnail URL</label>
        <Input {...register("thumbnail")} />
        <p className="text-sm text-red-500">{errors.thumbnail?.message}</p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
