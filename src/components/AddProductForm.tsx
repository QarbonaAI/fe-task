"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import axios from "axios";
import { ENDPOINT } from "@/app/page";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

type ProductInput = z.infer<typeof schema>;

export function AddProductForm() {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ProductInput) => {
      const res = await axios.post(ENDPOINT, data);
      return res.data;
    },

    onSuccess: (newProduct) => {
      const completeProduct = {
        id: newProduct.id,
        title: newProduct.title,
        price: newProduct.price,
        rating: newProduct.rating ?? 0,
        stock: newProduct.stock ?? 0,
        brand: newProduct.brand ?? "Unknown",
        category: newProduct.category ?? "Uncategorized",
        isLocal: true,
      };

      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return;
        return {
          ...old,
          products: [completeProduct, ...old.products],
          total: old.total + 1,
        };
      });

      reset();
      closeRef.current?.click();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Enter product details and click Save.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" step="any" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              type="number"
              step="any"
              {...register("rating")}
            />
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock")} />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
