"use client";
import { useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ENDPOINT } from "@/app/page";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0),
  rating: z.coerce.number().min(0).max(5),
  stock: z.coerce.number().min(0),
});

type ProductInput = z.infer<typeof schema>;

export function ProductActions({ product }: { product: any }) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(schema),
    defaultValues: product,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductInput) => {
      if (product.isLocal) {
        return { ...product, ...data };
      }

      const res = await axios.put(`${ENDPOINT}/${product.id}`, data);
      return res.data;
    },

    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["products"], (old: any) => {
        return {
          ...old,
          products: old.products.map((p: any) =>
            p.id === product.id ? { ...p, ...updatedProduct } : p,
          ),
        };
      });
      closeRef.current?.click();
      setIsEditOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (product.isLocal) {
        return { id: product.id };
      } else {
        const res = await axios.delete(`${ENDPOINT}/${product.id}`);
        return res.data;
      }
    },

    onSuccess: () => {
      queryClient.setQueryData(["products"], (old: any) => {
        return {
          ...old,
          products: old.products.filter((p: any) => p.id !== product.id),
          total: old.total - 1,
        };
      });
    },
  });

  return (
    <div className="flex items-center gap-4">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <button
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
            onClick={() => reset(product)}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="grid gap-4"
          >
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product info and save.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="any"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register("stock")} />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" ref={closeRef}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <button
        className="text-red-600 hover:text-red-800"
        title="Delete"
        onClick={() => deleteMutation.mutate()}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
