"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productSchema, type ProductFormData } from "@/lib/schemas";
import { useCategories } from "@/hooks/use-products";
import { X, Plus } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newImage, setNewImage] = useState("");

  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      category: product?.category ?? "",
      price: product?.price ?? 0,
      discountPercentage: product?.discountPercentage ?? 0,
      rating: product?.rating ?? 0,
      stock: product?.stock ?? 0,
      brand: product?.brand ?? "",
      sku: product?.sku ?? "",
      weight: product?.weight ?? 0,
      dimensions: {
        width: product?.dimensions?.width ?? 0,
        height: product?.dimensions?.height ?? 0,
        depth: product?.dimensions?.depth ?? 0,
      },
      warrantyInformation: product?.warrantyInformation ?? "",
      shippingInformation: product?.shippingInformation ?? "",
      availabilityStatus: product?.availabilityStatus ?? "In Stock",
      returnPolicy: product?.returnPolicy ?? "",
      minimumOrderQuantity: product?.minimumOrderQuantity ?? 1,
      thumbnail: product?.thumbnail ?? "",
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setImages(images.filter(image => image !== imageToRemove));
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
      tags,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <Input
              {...register("title")}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category *
            </label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                {categories?.map((category) => (
                  <SelectItem key={category} value={category} className="text-slate-800 dark:text-slate-100">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Brand *
            </label>
            <Input
              {...register("brand")}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="Product brand"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
            )}
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pricing & Stock</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price *
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Discount %
              </label>
              <Input
                type="number"
                step="0.1"
                {...register("discountPercentage", { valueAsNumber: true })}
                className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                placeholder="0"
              />
              {errors.discountPercentage && (
                <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rating
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register("rating", { valueAsNumber: true })}
                className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                placeholder="0.0"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Stock *
              </label>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              SKU *
            </label>
            <Input
              {...register("sku")}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="Stock keeping unit"
            />
            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Physical Properties */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Physical Properties</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Weight (kg) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("weight", { valueAsNumber: true })}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="0.00"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Width (cm) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("dimensions.width", { valueAsNumber: true })}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="0.00"
            />
            {errors.dimensions?.width && (
              <p className="text-red-500 text-sm mt-1">{errors.dimensions.width.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Height (cm) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("dimensions.height", { valueAsNumber: true })}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="0.00"
            />
            {errors.dimensions?.height && (
              <p className="text-red-500 text-sm mt-1">{errors.dimensions.height.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Depth (cm) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("dimensions.depth", { valueAsNumber: true })}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="0.00"
            />
            {errors.dimensions?.depth && (
              <p className="text-red-500 text-sm mt-1">{errors.dimensions.depth.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Policies & Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Policies & Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Warranty Information *
            </label>
            <textarea
              {...register("warrantyInformation")}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Warranty details"
            />
            {errors.warrantyInformation && (
              <p className="text-red-500 text-sm mt-1">{errors.warrantyInformation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Shipping Information *
            </label>
            <textarea
              {...register("shippingInformation")}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Shipping details"
            />
            {errors.shippingInformation && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingInformation.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Return Policy *
            </label>
            <textarea
              {...register("returnPolicy")}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Return policy details"
            />
            {errors.returnPolicy && (
              <p className="text-red-500 text-sm mt-1">{errors.returnPolicy.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Availability Status *
            </label>
            <Select
              value={watch("availabilityStatus")}
              onValueChange={(value) => setValue("availabilityStatus", value)}
            >
              <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectItem value="In Stock" className="text-slate-800 dark:text-slate-100">In Stock</SelectItem>
                <SelectItem value="Out of Stock" className="text-slate-800 dark:text-slate-100">Out of Stock</SelectItem>
                <SelectItem value="Pre-order" className="text-slate-800 dark:text-slate-100">Pre-order</SelectItem>
                <SelectItem value="Discontinued" className="text-slate-800 dark:text-slate-100">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            {errors.availabilityStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.availabilityStatus.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Minimum Order Quantity *
          </label>
          <Input
            type="number"
            min="1"
            {...register("minimumOrderQuantity", { valueAsNumber: true })}
            className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            placeholder="1"
          />
          {errors.minimumOrderQuantity && (
            <p className="text-red-500 text-sm mt-1">{errors.minimumOrderQuantity.message}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Images</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Thumbnail URL *
          </label>
          <Input
            {...register("thumbnail")}
            className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            placeholder="https://example.com/thumbnail.jpg"
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Additional Images *
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="https://example.com/image.jpg"
            />
            <Button
              type="button"
              onClick={addImage}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-sm"
              >
                <span className="text-slate-800 dark:text-slate-100 truncate max-w-32">{image}</span>
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tags</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Product Tags *
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
              placeholder="Enter tag"
            />
            <Button
              type="button"
              onClick={addTag}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm"
              >
                <span className="text-blue-800 dark:text-blue-200">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
} 