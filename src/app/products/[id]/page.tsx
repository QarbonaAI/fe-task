"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Package, DollarSign } from "lucide-react";
import Navbar from "@/components/navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const editProductSchema = z.object({
    title: z.string().min(1, 'Title required').max(100, 'Max 100 chars'),
    description: z.string().min(1, 'Description required').max(500, 'Max 500 chars'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    stock: z.coerce.number().min(0, 'Stock must be positive'),
    brand: z.string().min(1, 'Brand required'),
    category: z.string().min(1, 'Category required'),
  });

  const editForm = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: product || {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      brand: '',
      category: '',
    },
    values: product || undefined,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      editForm.reset(product);
    }
    // eslint-disable-next-line
  }, [product]);

  const handleEditProduct = async (values: z.infer<typeof editProductSchema>) => {
    setEditLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    setProduct((prev) => prev ? { ...prev, ...values } : prev);
    setEditLoading(false);
    setEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            className="mb-6 flex items-center gap-2 rounded-lg font-semibold"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Card */}
            <Card className="flex items-center justify-center p-8 rounded-2xl shadow-md">
              {loading ? (
                <div className="w-80 h-80 bg-muted animate-pulse rounded-xl" />
              ) : error ? (
                <div className="text-center py-12 text-destructive">{error}</div>
              ) : product ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-80 h-80 object-contain rounded-xl border bg-white"
                />
              ) : null}
            </Card>
            {/* Details Card */}
            <div className="flex flex-col gap-6">
              <Card className="p-6 rounded-2xl shadow-md">
                {product && (
                  <>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {product.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {product.brand}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-base">{product.rating}</span>
                      <Badge variant="secondary" className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800">
                        In Stock
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mb-4">
                      {product.description}
                    </div>
                  </>
                )}
              </Card>
              {/* Price/Stock Card */}
              <Card className="p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
                {product && (
                  <>
                    <div className="flex flex-col items-center flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-6 h-6 text-primary" />
                        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{product.discountPercentage}% off</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <Package className="w-6 h-6 text-primary" />
                      <span className="text-2xl font-bold">{product.stock}</span>
                      <span className="text-xs text-muted-foreground">Units Available</span>
                    </div>
                  </>
                )}
              </Card>
              {/* Actions Card */}
              <Card className="p-6 rounded-2xl shadow-md flex flex-col gap-3">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 flex items-center justify-center gap-2">
                  <span>Add to Cart</span>
                </Button>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full font-semibold text-base py-6">
                      Edit Product Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg rounded-2xl p-0 bg-background dark:bg-[#18181b] shadow-2xl">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={editForm.handleSubmit(handleEditProduct)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
                    >
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input {...editForm.register('title')} maxLength={100} className="focus-visible:ring-primary" />
                        {editForm.formState.errors.title && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.title.message}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea {...editForm.register('description')} maxLength={500} className="focus-visible:ring-primary min-h-[80px]" />
                        {editForm.formState.errors.description && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.description.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            {...editForm.register('price', { valueAsNumber: true })}
                            type="number"
                            min={0}
                            step={0.01}
                            className="pl-6 focus-visible:ring-primary"
                          />
                        </div>
                        {editForm.formState.errors.price && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.price.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <Input {...editForm.register('stock', { valueAsNumber: true })} type="number" min={0} className="focus-visible:ring-primary" />
                        {editForm.formState.errors.stock && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.stock.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Brand</label>
                        <Input {...editForm.register('brand')} className="focus-visible:ring-primary" />
                        {editForm.formState.errors.brand && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.brand.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input {...editForm.register('category')} className="focus-visible:ring-primary" />
                        {editForm.formState.errors.category && <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.category.message}</p>}
                      </div>
                      <DialogFooter className="col-span-2 mt-4 flex gap-2">
                        <Button
                          type="submit"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
                          disabled={editLoading}
                        >
                          {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline" disabled={editLoading}>
                            Cancel
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 