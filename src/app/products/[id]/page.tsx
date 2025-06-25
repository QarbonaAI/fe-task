"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { productsApi } from "@/api/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/products">
          <Button variant="outline">← Back to Products</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl font-semibold text-green-600">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
            <div>
              <span className="font-semibold">Category:</span> {product.category}
            </div>
            <div>
              <span className="font-semibold">Rating:</span> {product.rating}/5
            </div>
            <div>
              <span className="font-semibold">Stock:</span> {product.stock}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}