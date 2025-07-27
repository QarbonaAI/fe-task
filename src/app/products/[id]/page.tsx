"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/api/products.queries";

function ProductDetailSkeleton() {
  return (
    <main className="p-8 max-w-2xl mx-auto animate-pulse">
      <div className="h-8 w-1/2 bg-gray-200 rounded mb-4" />
      <div className="flex gap-8 mb-4">
        <div className="w-48 h-48 bg-gray-200 rounded border" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-gray-200 rounded mb-4" />
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-24 h-24 bg-gray-200 rounded border" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id ? Number(params.id) : undefined;
  const { data: product, isLoading, isError } = useProduct(id!);

  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} – MyShop`;
    }
    return () => {
      document.title = "All Products – MyShop";
    };
  }, [product?.title]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !product) return <main className="p-8 text-red-600">Failed to load product.</main>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="flex gap-8 mb-4">
        <img src={product.thumbnail} alt={product.title} className="w-48 h-48 object-cover rounded border" />
        <div>
          <p className="mb-2"><span className="font-semibold">Price:</span> ${product.price}</p>
          <p className="mb-2"><span className="font-semibold">Brand:</span> {product.brand}</p>
          <p className="mb-2"><span className="font-semibold">Category:</span> {product.category}</p>
          <p className="mb-2"><span className="font-semibold">Stock:</span> {product.stock}</p>
          <p className="mb-2"><span className="font-semibold">Rating:</span> {product.rating}</p>
        </div>
      </div>
      <p className="mb-4"><span className="font-semibold">Description:</span> {product.description}</p>
      <div>
        <h2 className="text-xl font-bold mb-2">Images</h2>
        <div className="flex gap-2 flex-wrap">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={product.title + " image"} className="w-24 h-24 object-cover rounded border" />
          ))}
        </div>
      </div>
    </main>
  );
} 